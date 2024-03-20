import {
  getOptions,
  getConfigs,
  getClientApp,
  getSplashscreen,
} from '../utils/app.js';

export function UseClientApp() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getClientApp(),
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
