/* eslint-disable @typescript-eslint/no-explicit-any */
import {customElement} from 'lit/decorators.js';
import {getDIRegistry, getConfigs} from './methods';
import {
  TiniComponentType,
  TiniComponentChild,
  AppOptions,
  DependencyProviders,
  DependencyDef,
  DependencyProvider,
  ObservableSubscriptionCallback,
} from './types';
import {
  APP_ROOT,
  GLOBAL,
  COMPONENT_TYPES,
  LIFECYCLE_HOOKS,
  NO_REGISTER_ERROR,
} from './consts';
import {
  isClass,
  getAppInstance,
  getAppSplashscreen,
  hideAppSplashscreen,
  registerGlobalHook,
} from './methods';
import {ObservableSubscription} from './observable';

import ___checkForDIMissingDependencies from '../dev/di-checker';

export function App(providers: DependencyProviders, options: AppOptions = {}) {
  return function (target: any) {
    GLOBAL.$tiniAppOptions = options; // set options
    // register the exit of the app splashscreen
    if (options.splashscreen) {
      registerGlobalHook(
        COMPONENT_TYPES.PAGE,
        LIFECYCLE_HOOKS.ON_CHILDREN_READY,
        (_, opts) =>
          opts?.splashscreen !== 'auto' ? undefined : hideAppSplashscreen()
      );
    }
    // create app
    class result extends target {
      $options = GLOBAL.$tiniAppOptions;
      componentType = COMPONENT_TYPES.APP;
    }
    // load the registry
    const dependencyRegistry = getDIRegistry();
    // add the registers
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

export function Component(tagName: string, type?: TiniComponentType) {
  return function (target: any) {
    class result extends target {
      componentType = type || COMPONENT_TYPES.COMPONENT;
    }
    return customElement(tagName)(result as any);
  };
}

export function Page(tagName: string) {
  return Component(tagName, COMPONENT_TYPES.PAGE);
}

export function Layout(tagName: string) {
  return Component(tagName, COMPONENT_TYPES.LAYOUT);
}

export function UseApp() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppInstance(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function UseOptions() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => GLOBAL.$tiniAppOptions,
      enumerable: false,
      configurable: false,
    });
  };
}

export function UseConfigs() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getConfigs(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function UseSplashscreen() {
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
    const onChangedHandlers = [] as Array<
      ObservableSubscriptionCallback<unknown>
    >;
    Reflect.defineProperty(target, valueKey, {
      value: undefined,
      writable: true,
      enumerable: false,
      configurable: false,
    });
    Reflect.defineProperty(target, registerKey, {
      value: (cb: ObservableSubscriptionCallback<unknown>) => {
        const index = onChangedHandlers.length;
        // register the handler
        onChangedHandlers[index] = cb;
        // initial
        const currentVal = target[valueKey];
        if (!noInitial && currentVal !== undefined) {
          onChangedHandlers[index](currentVal, undefined);
        }
        // unsubcribe
        return () => onChangedHandlers.splice(index, 1);
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

export function SubscribeObservable() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: new ObservableSubscription(target as any),
      enumerable: false,
      configurable: false,
    });
  };
}
