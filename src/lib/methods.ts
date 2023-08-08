/* eslint-disable @typescript-eslint/no-explicit-any */
import {CSSResult} from 'lit';
import {GLOBAL, APP_ROOT, APP_SPLASHSCREEN_ID, NO_APP_ERROR} from './consts';
import {
  TiniApp,
  Global,
  DIRegistry,
  LHRegistry,
  TiniComponentInstance,
  TiniComponentType,
  TiniLifecycleHook,
  GlobalLifecycleHook,
  AppSplashscreenComponent,
  UseComponentsList,
  ThemingOptions,
} from './types';

export function asset(path: string) {
  return path;
}

export function isClass(input: unknown) {
  return (
    typeof input === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(input))
  );
}

export function getDIRegistry() {
  return (GLOBAL.$tiniDIRegistry ||= {
    registers: new Map<string, () => Promise<any>>(),
    instances: new Map<string, any>(),
    awaiters: [],
  }) as DIRegistry;
}

export function getAppInstance(fallbackToGlobal?: boolean) {
  const app = document.querySelector(APP_ROOT);
  if (!app && !fallbackToGlobal) throw NO_APP_ERROR;
  return (app || GLOBAL) as TiniApp | Global;
}

export function getConfigs(): null | Record<string, unknown> {
  const appOrGlobal = getAppInstance(true);
  return (
    (appOrGlobal as TiniApp).$configs ||
    (appOrGlobal as Global).$tiniConfigs ||
    null
  );
}

export function registerGlobalHook(
  componentTypeOrTypes: TiniComponentType | TiniComponentType[],
  hookCycleOrCycles: TiniLifecycleHook | TiniLifecycleHook[],
  hookAction: GlobalLifecycleHook
) {
  // init the registry
  GLOBAL.$tiniLHRegistry ||= {} as LHRegistry;
  const registry = GLOBAL.$tiniLHRegistry;
  // cycles & types
  const componentTypes =
    typeof componentTypeOrTypes === 'string'
      ? [componentTypeOrTypes]
      : componentTypeOrTypes;
  const hookCycles =
    typeof hookCycleOrCycles === 'string'
      ? [hookCycleOrCycles]
      : hookCycleOrCycles;
  // organize
  for (let i = 0; i < componentTypes.length; i++) {
    const type = componentTypes[i];
    if (!registry[type]) registry[type] = {} as any;
    for (let j = 0; j < hookCycles.length; j++) {
      const cycle = hookCycles[j];
      if (!registry[type][cycle]) registry[type][cycle] = [];
      registry[type][cycle].push(hookAction);
    }
  }
  // result
  return registry;
}

export function getGlobalHooks(
  type: TiniComponentType,
  cycle: TiniLifecycleHook
) {
  return GLOBAL.$tiniLHRegistry?.[type]?.[cycle];
}

export function runGlobalHooks(
  cycle: TiniLifecycleHook,
  component: TiniComponentInstance
) {
  const globalHooks = getGlobalHooks(component.componentType, cycle);
  if (!globalHooks?.length) return;
  const appOrGlobal = getAppInstance(true);
  globalHooks.forEach(action =>
    action(component, appOrGlobal, GLOBAL.$tiniAppOptions)
  );
}

export function getAppSplashscreen() {
  return document.getElementById(APP_SPLASHSCREEN_ID);
}

export function hideAppSplashscreen() {
  const node = getAppSplashscreen() as AppSplashscreenComponent;
  if (!node) return;
  if (node.hide instanceof Function) {
    node.hide();
  } else {
    node.remove();
  }
}

export function stylingWithBases<Themes extends string>(
  bases: Array<Record<Themes, CSSResult>>,
  additionalStyling?: Record<Themes, CSSResult[]>
) {
  // bases
  const styling = bases.reduce(
    (result, item) => {
      Object.keys(item).forEach(key => {
        result[key] ||= [];
        result[key].push(item[key as Themes]);
      });
      return result;
    },
    {} as Record<string, CSSResult[]>
  );
  // more
  if (additionalStyling) {
    Object.keys(additionalStyling).forEach(key => {
      styling[key] ||= [];
      styling[key].push(...additionalStyling[key as Themes]);
    });
  }
  // result
  return styling as NonNullable<ThemingOptions<Themes>['styling']>;
}

export function useComponents(items: UseComponentsList) {
  items.forEach(item => {
    const [constructor, tagName] =
      item instanceof Array ? item : [item, (item as any).defaultTagName];
    if (!tagName || !constructor) return;
    const isDefined = customElements.get(tagName);
    if (!isDefined) {
      customElements.define(tagName, constructor);
    }
  });
}

export function changeTheme({soul, skin}: {soul?: string; skin?: string}) {
  const [currentSoul, currentSkin] =
    document.body.dataset.theme?.split('/') || [];
  soul ||= currentSoul;
  skin ||= currentSkin;
  if (soul && skin) {
    document.body.dataset.theme = `${soul}/${skin}`;
    if (soul !== currentSoul) {
      GLOBAL.$tiniThemingSubsciptions?.forEach(subscription =>
        subscription(soul as string)
      );
    }
  }
}
