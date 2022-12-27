import {getAppInstance} from './helpers';

export function UseApp() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppInstance(),
    });
  };
}

export function UseConfigs() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppInstance().configs,
    });
  };
}

export function UseService(name?: string) {
  return function (target: Object, propertyKey: string) {
    const instanceName = name
      ? name[0].toLowerCase() + name.substring(1)
      : propertyKey;
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppInstance()[instanceName],
    });
  };
}
