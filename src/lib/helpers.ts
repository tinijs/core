import {GLOBAL, NO_APP_ERROR} from './consts';
import {ServiceProvider} from './types';

export function varName(className: string) {
  return className[0].toLowerCase() + className.substring(1);
}

export function getAppInstance<App>(fallbackToGlobal?: boolean): App {
  const app = document.querySelector('app-root') as unknown as App;
  if (!app && !fallbackToGlobal) throw NO_APP_ERROR;
  return app || GLOBAL;
}

export function provideServices(
  registry: Record<string, ServiceProvider> = {}
) {
  // create the registers
  Object.keys(registry).forEach(className => {
    const {provider, deps = []} = registry[className];
    const instanceName = varName(className);
    const registerName = `$${instanceName}Register`;
    // already registered
    if (GLOBAL[registerName]) return;
    // add the register
    GLOBAL[registerName] = async () => {
      // already initialized
      if (GLOBAL[instanceName]) return;
      // resolve deps
      const depInstances: Object[] = [];
      for (let i = 0; i < deps.length; i++) {
        const depInstanceName = varName(deps[i]);
        if (!GLOBAL[depInstanceName]) {
          await GLOBAL[`$${depInstanceName}Register`]();
        }
        depInstances.push(GLOBAL[depInstanceName]);
      }
      // the service
      const m = await provider();
      const singleton = new m[className](...depInstances);
      // result
      return (GLOBAL[instanceName] = singleton);
    };
  });
}
