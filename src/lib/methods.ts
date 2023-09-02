/* eslint-disable @typescript-eslint/no-explicit-any */
import {CSSResult} from 'lit';
import {ThemingOptions} from 'tinijs';

import {
  GLOBAL,
  APP_ROOT,
  APP_SPLASHSCREEN_ID,
  NO_APP_ERROR,
  ComponentTypes,
  LifecycleHooks,
} from './consts';
import {
  DIRegistry,
  LHRegistry,
  TiniComponentInstance,
  GlobalLifecycleHook,
  AppSplashscreenComponent,
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
  return (GLOBAL.DIRegistry ||= {
    registers: new Map<string, () => Promise<any>>(),
    instances: new Map<string, any>(),
    awaiters: [],
  }) as DIRegistry;
}

export function getAppInstance() {
  const app = (GLOBAL.app ||= document.querySelector(APP_ROOT));
  if (!app) throw NO_APP_ERROR;
  return app;
}

export function getOptions() {
  return getAppInstance().options;
}

export function getConfigs() {
  return getAppInstance().configs;
}

export function registerGlobalHook(
  componentTypeOrTypes: ComponentTypes | ComponentTypes[],
  hookCycleOrCycles: LifecycleHooks | LifecycleHooks[],
  hookAction: GlobalLifecycleHook
) {
  // init the registry
  const registry = (GLOBAL.LHRegistry ||= {} as LHRegistry);
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

export function getGlobalHooks(type: ComponentTypes, cycle: LifecycleHooks) {
  return GLOBAL.LHRegistry?.[type]?.[cycle];
}

export function runGlobalHooks(
  cycle: LifecycleHooks,
  component: TiniComponentInstance
) {
  const globalHooks = getGlobalHooks(component.componentType, cycle);
  globalHooks?.forEach(action => action(component, GLOBAL));
  return globalHooks;
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
