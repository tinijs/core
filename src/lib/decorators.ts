/* eslint-disable @typescript-eslint/no-explicit-any */
import {adoptStyles} from 'lit';
import {customElement} from 'lit/decorators.js';
import {
  Global,
  TiniApp,
  TiniComponentChild,
  AppOptions,
  ComponentOptions,
  DependencyDef,
  DependencyProvider,
  ObserverCallback,
  UseComponentsList,
  ThemingOptions,
} from './types';
import {
  APP_ROOT,
  GLOBAL,
  ComponentTypes,
  LifecycleHooks,
  NO_REGISTER_ERROR,
} from './consts';
import {
  isClass,
  getDIRegistry,
  getConfigs,
  getAppInstance,
  getAppSplashscreen,
  hideAppSplashscreen,
  registerGlobalHook,
  useComponents,
} from './methods';
import {Observer} from './observable';

import ___checkForDIMissingDependencies from './di-checker';

export function Components(items: UseComponentsList) {
  return function (target: any) {
    useComponents(items);
    return target;
  };
}

export function Theming<Themes extends string>({
  styling,
  scripting,
}: ThemingOptions<Themes>) {
  return function (target: any) {
    // originals
    const originalConnectedCallback = target.prototype.connectedCallback;
    const originalDisconnectedCallback = target.prototype.disconnectedCallback;
    const originalUpdated = target.prototype.updated;
    // styles
    const unsubscribeKey = Symbol();
    const applyStyles = (host: any, soulId?: Themes) => {
      soulId ||= document.body.dataset.theme?.split('/')[0] as Themes;
      // retrieve styles
      const originalStyles = target.styles || [];
      const styles = (
        !styling
          ? []
          : !soulId || !styling[soulId]
          ? Object.values(styling)[0]
          : (styling[soulId] as any)
      ).concat(
        originalStyles instanceof Array ? originalStyles : [originalStyles]
      );
      // affect
      adoptStyles(host.shadowRoot, styles);
    };
    // scripts
    const unscriptKey = Symbol();
    const applyScripts = (host: any, soulId?: Themes) => {
      soulId ||= document.body.dataset.theme?.split('/')[0] as Themes;
      // retrieve scripts
      const scripts: any = !scripting
        ? {}
        : !soulId || !scripting[soulId]
        ? Object.values(scripting)[0]
        : scripting[soulId];
      // affect
      if (host[unscriptKey]) host[unscriptKey](host);
      if (scripts?.unscript) host[unscriptKey] = scripts.unscript;
      if (scripts?.script) scripts.script(host);
    };

    // connected/disconnected
    target.prototype.connectedCallback = function () {
      originalConnectedCallback?.bind(this)();
      // watch for soul change
      if (!GLOBAL.$tiniThemingSubsciptions) {
        GLOBAL.$tiniThemingSubsciptions = new Map();
      }
      GLOBAL.$tiniThemingSubsciptions.set(unsubscribeKey, soul => {
        applyStyles(this, soul as Themes);
        applyScripts(this, soul as Themes);
      });
      this[unsubscribeKey] = () =>
        GLOBAL.$tiniThemingSubsciptions?.delete(unsubscribeKey);
      // apply styles
      applyStyles(this);
    };
    target.prototype.disconnectedCallback = function () {
      originalDisconnectedCallback?.bind(this)();
      // unwatch for soul change
      this[unsubscribeKey]?.();
    };

    // updated
    target.prototype.updated = function (...params: any[]) {
      originalUpdated?.bind(this)(...params);
      // apply scripts
      applyScripts(this);
    };

    return target;
  };
}

export function App(options: AppOptions = {}) {
  return function (target: any) {
    GLOBAL.$tiniAppOptions = options; // set options
    // register the exit of the app splashscreen
    if (options.splashscreen) {
      registerGlobalHook(
        ComponentTypes.Page,
        LifecycleHooks.OnChildrenReady,
        (page, appOrGlobal, opts) =>
          opts?.splashscreen !== 'auto' ? undefined : hideAppSplashscreen()
      );
    }
    // register page metas
    registerGlobalHook(
      ComponentTypes.Page,
      LifecycleHooks.OnReady,
      (page, appOrGlobal) =>
        (
          (appOrGlobal as TiniApp).$meta || (appOrGlobal as Global).$tiniMeta
        )?.setPageMetas(page.metas, location.pathname === '/')
    );
    // create app
    class result extends target {
      readonly constructorName = target.name;
      readonly $options = GLOBAL.$tiniAppOptions;
      readonly componentType = ComponentTypes.App;
    }
    // load the registry
    const dependencyRegistry = getDIRegistry();
    // add the registers
    const providers = options.providers || {};
    const providerIds = Object.keys(providers);
    for (let i = 0; i < providerIds.length; i++) {
      const id = providerIds[i];
      const value = providers[id] as any;
      // extract the provider and deps
      const {provider, deps} = !value?.provider
        ? {provider: value as DependencyProvider, deps: []}
        : (value as DependencyDef);
      // the register
      let theRegister = dependencyRegistry.registers.get(id);
      if (theRegister) return; // already registered
      theRegister = async () => {
        let result = dependencyRegistry.instances.get(id);
        // already initialized
        if (result) return;
        // resolve deps
        const depInstances: Object[] = [];
        if (deps?.length) {
          for (let j = 0; j < deps.length; j++) {
            const depId = deps[j];
            let depInstance = dependencyRegistry.instances.get(depId);
            if (!depInstance) {
              const theDepRegister = dependencyRegistry.registers.get(depId);
              if (!theDepRegister) throw NO_REGISTER_ERROR(depId);
              depInstance = await theDepRegister();
            }
            depInstances.push(depInstance);
          }
        }
        // result
        const m = await provider();
        const dependency = !m.default ? m : m.default;
        result = !isClass(dependency)
          ? dependency
          : new dependency(...depInstances);
        // <DEVELOPMENT>
        if (process.env.NODE_ENV === 'development') {
          ___checkForDIMissingDependencies(id, dependency, result);
        }
        // </DEVELOPMENT>
        return dependencyRegistry.instances.set(id, result).get(id);
      };
      dependencyRegistry.registers.set(id, theRegister).get(id);
    }
    // digest the await queue
    if (dependencyRegistry.awaiters?.length) {
      for (let i = 0; i < dependencyRegistry.awaiters.length; i++) {
        dependencyRegistry.awaiters[i]();
      }
    }
    // forward the app root
    return customElement(APP_ROOT)(result as any);
  };
}

export function Component<Themes extends string>(
  options: ComponentOptions<Themes> = {}
) {
  if (options.components) useComponents(options.components);
  return function (target: any) {
    class result extends target {
      readonly constructorName = target.name;
      readonly componentType = options.type || ComponentTypes.Component;
    }
    if (options.theming) Theming(options.theming)(result);
    return !options.name ? result : customElement(options.name)(result as any);
  };
}

export function Page<Themes extends string>(
  options?: Omit<ComponentOptions<Themes>, 'type'>
) {
  return Component({...options, type: ComponentTypes.Page});
}

export function Layout<Themes extends string>(
  options?: Omit<ComponentOptions<Themes>, 'type'>
) {
  return Component({...options, type: ComponentTypes.Layout});
}

export function GetApp() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppInstance(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function GetOptions() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => GLOBAL.$tiniAppOptions,
      enumerable: false,
      configurable: false,
    });
  };
}

export function GetConfigs() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getConfigs(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function GetSplashscreen() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppSplashscreen(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function Inject(id?: string) {
  return function (target: TiniComponentChild, propertyKey: string) {
    const depId = (id || propertyKey) as string;
    const dependencyRegistry = getDIRegistry();
    // the pending
    const pending = async () => {
      let result = dependencyRegistry.instances.get(depId);
      if (!result) {
        const register = dependencyRegistry.registers.get(depId);
        if (!register) throw NO_REGISTER_ERROR(depId);
        result = dependencyRegistry.instances
          .set(depId, await register())
          .get(depId);
      }
      return result;
    };
    // queue the dependencies
    const theRegister = dependencyRegistry.registers.get(depId);
    target._pendingDI ||= [];
    if (!theRegister) {
      let resolveSchedule = () => {};
      const scheduledPending = new Promise(
        resolve => (resolveSchedule = resolve as any)
      );
      dependencyRegistry.awaiters.push(() => resolveSchedule());
      target._pendingDI.push(() => scheduledPending.then(() => pending()));
    } else {
      target._pendingDI.push(pending);
    }
    // result
    Reflect.defineProperty(target, propertyKey, {
      get: () => dependencyRegistry.instances.get(depId),
      enumerable: false,
      configurable: false,
    });
  };
}

export function Vendor(id?: string) {
  return Inject(id);
}

export function Observable(registerName?: string, noInitial?: boolean) {
  return function (target: any, propertyKey: string) {
    const valueKey = `_${propertyKey}Value`;
    const registerKey = registerName || `${propertyKey}Changed`;
    const onChangedHandlers: Map<symbol, ObserverCallback<unknown>> = new Map();
    Reflect.defineProperty(target, valueKey, {
      value: undefined,
      writable: true,
      enumerable: false,
      configurable: false,
    });
    Reflect.defineProperty(target, registerKey, {
      value: (cb: ObserverCallback<unknown>) => {
        const subsciptionId = Symbol();
        // register the handler
        onChangedHandlers.set(subsciptionId, cb);
        // initial
        const currentVal = target[valueKey];
        if (!noInitial && currentVal !== undefined) {
          onChangedHandlers.get(subsciptionId)?.(currentVal, undefined);
        }
        // unsubcribe
        return () => onChangedHandlers.delete(subsciptionId);
      },
      enumerable: false,
      configurable: false,
    });
    Reflect.defineProperty(target, propertyKey, {
      get: () => target[valueKey],
      set: newVal => {
        let oldVal = target[valueKey];
        oldVal =
          !oldVal || typeof oldVal !== 'object'
            ? oldVal
            : JSON.parse(JSON.stringify(oldVal));
        target[valueKey] = newVal;
        onChangedHandlers.forEach(
          handler => handler && handler(newVal, oldVal)
        );
      },
      enumerable: false,
      configurable: false,
    });
  };
}

export function Observe() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: new Observer(target as any),
      enumerable: false,
      configurable: false,
    });
  };
}
