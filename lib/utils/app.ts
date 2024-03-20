import {NO_APP_ERROR, SPLASHSCREEN_ID} from '../consts/common.js';
import {GLOBAL_TINI} from '../consts/global.js';
import {
  ClientApp,
  TiniComponent,
  DIRegistry,
  LHRegistry,
  GlobalLifecycleHook,
  SplashscreenComponent,
  ComponentTypes,
  LifecycleHooks,
} from '../classes/tini-component.js';

export function getDIRegistry() {
  return (GLOBAL_TINI.DIRegistry ||= {
    registers: new Map<string, () => Promise<any>>(),
    instances: new Map<string, any>(),
    awaiters: [],
  }) as DIRegistry;
}

export function getClientApp<AppRoot extends TiniComponent>() {
  if (!GLOBAL_TINI.clientApp) throw NO_APP_ERROR;
  return GLOBAL_TINI.clientApp as ClientApp<AppRoot>;
}

export function getOptions() {
  return GLOBAL_TINI.clientApp?.options || {};
}

export function getConfigs<AppConfigs extends Record<string, unknown>>() {
  return (GLOBAL_TINI.clientApp?.configs || {}) as AppConfigs;
}

export function registerConfigs<AppConfigs extends Record<string, unknown>>(
  configs: AppConfigs
) {
  if (!GLOBAL_TINI.clientApp) throw NO_APP_ERROR;
  return (GLOBAL_TINI.clientApp.configs = configs);
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
    clientApp: getClientApp(),
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
