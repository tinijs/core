/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  CSSResultOrNative,
  PropertyValues,
  adoptStyles,
  getCompatibleStyle,
  unsafeCSS,
} from 'lit';
import {customElement} from 'lit/decorators.js';

import {GLOBAL_TINI, TINI_APP_CONTEXT} from './consts/global.js';
import {setUIOptions} from './utils/ui.js';
import {ActiveTheme, THEME_CHANGE_EVENT, getTheme} from './utils/theme.js';
import {registerComponents} from './utils/components.js';
import {processComponentStyles} from './utils/styles.js';
import {adoptScripts} from './utils/scripts.js';
import {
  AppOptions,
  ComponentOptions,
  DependencyDef,
  DependencyProvider,
} from './types.js';
import {
  APP_ROOT,
  ComponentTypes,
  LifecycleHooks,
  NO_REGISTER_ERROR,
} from './consts.js';
import {
  isClass,
  getDIRegistry,
  getOptions,
  getConfigs,
  getContext,
  getApp,
  getSplashscreen,
  hideSplashscreen,
  registerGlobalHook,
} from './methods.js';
import {TiniComponent} from './main.js';
import ___checkForDIMissingDependencies from './di-checker.js';

export function App<ExtendedUIOptions extends Record<string, unknown> = {}>(
  options: AppOptions<ExtendedUIOptions> = {}
) {
  return function (target: any) {
    // set app options
    TINI_APP_CONTEXT.options = options;

    // ui options
    if (options.uiOptions) {
      setUIOptions(options.uiOptions);
    }

    // register the exit of the app splashscreen
    if (options.splashscreen) {
      registerGlobalHook(
        ComponentTypes.Page,
        LifecycleHooks.OnChildrenReady,
        ({appContext}) => {
          if (appContext.options?.splashscreen !== 'auto') return;
          hideSplashscreen();
        }
      );
    }

    // dependencies management
    const dependencyRegistry = getDIRegistry();
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
        const depInstances: unknown[] = [];
        if (deps?.length) {
          for (let j = 0; j < deps.length; j++) {
            const depIdOrGetter = deps[j];
            if (depIdOrGetter instanceof Function) {
              depInstances.push(depIdOrGetter());
            } else {
              let depInstance = dependencyRegistry.instances.get(depIdOrGetter);
              if (!depInstance) {
                const theDepRegister =
                  dependencyRegistry.registers.get(depIdOrGetter);
                if (!theDepRegister) throw NO_REGISTER_ERROR(depIdOrGetter);
                depInstance = await theDepRegister();
              }
              depInstances.push(depInstance);
            }
          }
        }
        // result
        const m = await provider();
        const dependency = !m.default ? m : m.default;
        result = !isClass(dependency)
          ? dependency
          : new dependency(...depInstances);
        if (process.env.NODE_ENV === 'development') {
          ___checkForDIMissingDependencies(id, dependency, result);
        }
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

    // target modifications
    const result = class extends target {
      static readonly componentType = ComponentTypes.App;

      constructor(...args: unknown[]) {
        super(...args);
        // set the app & register components
        GLOBAL_TINI.app = this as unknown as TiniComponent;
        if (options.components) registerComponents(options.components);
      }
    } as any;

    // forward the target
    return customElement(APP_ROOT)(result);
  };
}

export function Component<ThemeId extends string>(
  options: ComponentOptions<ThemeId> = {}
) {
  return function (target: any) {
    // target modifications
    const result = class extends target {
      static readonly componentType = options.type || ComponentTypes.Component;

      private activeTheme = getTheme();

      protected createRenderRoot() {
        const renderRoot =
          this.shadowRoot ??
          this.attachShadow(
            (this.constructor as typeof LitElement).shadowRootOptions
          );
        this.customAdoptStyles(renderRoot);
        return renderRoot;
      }

      private onThemeChange = (e: Event) => {
        this.activeTheme = (e as CustomEvent<ActiveTheme>).detail;
        this.customAdoptStyles(this.shadowRoot || this);
        this.customAdoptScripts();
      };

      connectedCallback() {
        if (options.components) registerComponents(options.components);
        super.connectedCallback();
        addEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        removeEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
      }

      protected updated(changedProperties: PropertyValues<this>) {
        super.updated(changedProperties);
        this.customAdoptScripts();
      }

      private customAdoptStyles(renderRoot: HTMLElement | DocumentFragment) {
        const allStyles = [] as Array<string | CSSResultOrNative>;
        // theme styles
        const styling = options.theming?.styling;
        if (styling) {
          const {soulId, themeId} = this.activeTheme;
          allStyles.push(
            ...(styling[themeId as ThemeId] ||
              styling[soulId as ThemeId] ||
              Object.values(styling)[0] ||
              [])
          );
        }
        // element styles
        allStyles.push(
          ...(this.constructor as typeof LitElement).elementStyles
        );
        // adopt styles
        const styleText = processComponentStyles(allStyles, this.activeTheme);
        adoptStyles(renderRoot as unknown as ShadowRoot, [
          getCompatibleStyle(unsafeCSS(styleText)),
        ]);
      }

      private customAdoptScripts() {
        adoptScripts(
          this as unknown as HTMLElement,
          this.activeTheme,
          options.theming?.scripting
        );
      }
    } as any;

    // return or forward the target
    return !options.name ? result : customElement(options.name)(result);
  };
}

export function Page<ThemeId extends string>(
  options?: Omit<ComponentOptions<ThemeId>, 'type'>
) {
  return Component({...options, type: ComponentTypes.Page});
}

export function Layout<ThemeId extends string>(
  options?: Omit<ComponentOptions<ThemeId>, 'type'>
) {
  return Component({...options, type: ComponentTypes.Layout});
}

export function Inject(id?: string) {
  return function (prototype: any, propertyName: string) {
    const depId = (id || propertyName) as string;
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
    prototype.pendingDependencies ||= [];
    if (!theRegister) {
      let resolveSchedule = () => {};
      const scheduledPending = new Promise(
        resolve => (resolveSchedule = resolve as any)
      );
      dependencyRegistry.awaiters.push(() => resolveSchedule());
      prototype.pendingDependencies.push(() =>
        scheduledPending.then(() => pending())
      );
    } else {
      prototype.pendingDependencies.push(pending);
    }
    // result
    Object.defineProperty(prototype, propertyName, {
      get: () => dependencyRegistry.instances.get(depId),
    });
  };
}

export function Vendor(id?: string) {
  return Inject(id);
}

export function UseContext() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getContext(),
    });
  };
}

export function UseApp() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getApp(),
    });
  };
}

export function UseOptions() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getOptions(),
    });
  };
}

export function UseConfigs() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getConfigs(),
    });
  };
}

export function UseSplashscreen() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getSplashscreen(),
    });
  };
}
