/* eslint-disable @typescript-eslint/ban-ts-comment */
import {customElement} from 'lit/decorators.js';

import {GLOBAL, APP_ROOT} from './consts';
import {varName, getAppInstance} from './helpers';

export function App() {
  return customElement(APP_ROOT) as (target: any) => any;
}

export function Component(tagName: string) {
  return customElement(tagName) as (target: any) => any;
}

export function Page(tagName: string) {
  return Component(tagName);
}

export function Layout(tagName: string) {
  return Component(tagName);
}

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
      get: () => getAppInstance<any>(true).$configs,
    });
  };
}

export function UseService(className?: string) {
  return function (target: any, propertyKey: string) {
    const instanceName = !className ? propertyKey : varName(className);
    const registerName = `$${instanceName}Register`;
    // init resolve dependencies
    if (!target.$resolveDependencies) {
      target.$resolveDependencies = [];
    }
    // add dependency resolver
    target.$resolveDependencies.push(async () => {
      const singleton = await GLOBAL[registerName]();
      Reflect.defineProperty(target, propertyKey, {value: singleton});
      return singleton;
    });
  };
}
