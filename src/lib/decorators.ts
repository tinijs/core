import {customElement} from 'lit/decorators.js';

import {ComponentConstruct, TiniComponentChild} from './types';
import {GLOBAL, APP_ROOT} from './consts';
import {varName, depRegisterName, getAppInstance} from './methods';

export function App() {
  return Component(APP_ROOT);
}

export function Component(tagName: string) {
  return customElement(tagName) as ComponentConstruct;
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
      get: () => getAppInstance(true).$configs || {},
    });
  };
}

export function UseService(className?: string) {
  return function (target: TiniComponentChild, propertyKey: string) {
    const instanceName = !className ? propertyKey : varName(className);
    const registerName = depRegisterName(instanceName);
    target.$_pendingDependencies ||= [];
    target.$_pendingDependencies.push(async () => {
      const singleton = await GLOBAL[registerName]();
      Reflect.defineProperty(target, propertyKey, {value: singleton});
      return singleton;
    });
  };
}
