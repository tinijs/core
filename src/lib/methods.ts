import {GLOBAL, APP_ROOT, NO_APP_ERROR} from './consts';
import {DependencyProvider, TiniComponentInstance} from './types';

export function varName(className: string) {
  return className[0].toLowerCase() + className.substring(1);
}

export function depRegisterName(instanceName: string) {
  return `$_${instanceName}Register`;
}

export function getAppInstance(fallbackToGlobal?: boolean) {
  const app = document.querySelector(
    APP_ROOT
  ) as unknown as TiniComponentInstance;
  if (!app && !fallbackToGlobal) throw NO_APP_ERROR;
  return app || GLOBAL;
}

export function provideServices(
  registry: Record<string, DependencyProvider> = {}
) {
  Object.keys(registry).forEach(className => {
    const {provider, deps} = registry[className];
    const instanceName = varName(className);
    const registerName = depRegisterName(instanceName);
    if (GLOBAL[registerName]) return; // already registered
    GLOBAL[registerName] = async () => {
      if (GLOBAL[instanceName]) return; // already initialized
      // resolve deps
      const depInstances: Object[] = [];
      if (deps?.length) {
        for (let i = 0; i < deps.length; i++) {
          const depInstanceName = varName(deps[i]);
          if (!GLOBAL[depInstanceName]) {
            await GLOBAL[depRegisterName(depInstanceName)]();
          }
          depInstances.push(GLOBAL[depInstanceName]);
        }
      }
      // result
      const m = await provider();
      const singleton = new m[className](...depInstances);
      return (GLOBAL[instanceName] = singleton);
    };
  });
}
