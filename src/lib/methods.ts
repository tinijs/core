/* eslint-disable @typescript-eslint/no-explicit-any */
import {CSSResult} from 'lit';
import {ThemingOptions} from 'tinijs';

import {
  GLOBAL_TINI,
  TINI_APP_CONTEXT,
  SPLASHSCREEN_ID,
  NO_APP_ERROR,
  ComponentTypes,
  LifecycleHooks,
} from './consts';
import {
  DIRegistry,
  LHRegistry,
  AppContext,
  GlobalLifecycleHook,
  SplashscreenComponent,
} from './types';
import {TiniComponent} from './main';

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
  return (GLOBAL_TINI.DIRegistry ||= {
    registers: new Map<string, () => Promise<any>>(),
    instances: new Map<string, any>(),
    awaiters: [],
  }) as DIRegistry;
}

export function getContext<AppConfigs extends Record<string, unknown>>() {
  return TINI_APP_CONTEXT as AppContext<AppConfigs>;
}

export function getApp<AppRoot extends TiniComponent>() {
  if (!GLOBAL_TINI.app) throw NO_APP_ERROR;
  return GLOBAL_TINI.app as AppRoot;
}

export function getOptions() {
  return TINI_APP_CONTEXT.options || {};
}

export function getConfigs<AppConfigs extends Record<string, unknown>>() {
  return (TINI_APP_CONTEXT.configs || {}) as AppConfigs;
}

export function registerConfigs<AppConfigs extends Record<string, unknown>>(
  configs: AppConfigs
) {
  return (TINI_APP_CONTEXT.configs = configs);
}

export function registerGlobalHook(
  componentTypeOrTypes: ComponentTypes | ComponentTypes[],
  hookCycleOrCycles: LifecycleHooks | LifecycleHooks[],
  hookAction: GlobalLifecycleHook
) {
  // init the registry
  const registry = (GLOBAL_TINI.LHRegistry ||= {} as LHRegistry);
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
  return GLOBAL_TINI.LHRegistry?.[type]?.[cycle];
}

export function runGlobalHooks(
  cycle: LifecycleHooks,
  component: TiniComponent
) {
  const globalHooks = getGlobalHooks(
    (component.constructor as any).componentType,
    cycle
  );
  const data = {
    source: component,
    app: getApp(),
    appContext: getContext(),
  };
  globalHooks?.forEach(action => action(data));
  return globalHooks;
}

export function getSplashscreen() {
  return document.getElementById(SPLASHSCREEN_ID) || undefined;
}

export function hideSplashscreen() {
  const node = getSplashscreen() as SplashscreenComponent;
  if (!node) return;
  if (node.hide instanceof Function) {
    node.hide();
  } else {
    node.remove();
  }
}

export function stylingWithBases<ThemeId extends string>(
  bases: Array<Record<ThemeId, CSSResult>>,
  additionalStyling?: Record<ThemeId, CSSResult[]>
) {
  // bases
  const styling = bases.reduce(
    (result, item) => {
      Object.keys(item).forEach(key => {
        result[key] ||= [];
        result[key].push(item[key as ThemeId]);
      });
      return result;
    },
    {} as Record<string, CSSResult[]>
  );
  // more
  if (additionalStyling) {
    Object.keys(additionalStyling).forEach(key => {
      styling[key] ||= [];
      styling[key].push(...additionalStyling[key as ThemeId]);
    });
  }
  // result
  return styling as NonNullable<ThemingOptions<ThemeId>['styling']>;
}
