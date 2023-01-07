/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GLOBAL,
  APP_ROOT,
  APP_SPLASHSCREEN_ID,
  APP_SPLASHSCREEN,
  NO_APP_ERROR,
} from './consts';
import {TiniApp, Global, DIRegistry, AppSplashscreenComponent} from './types';

export function varName(className: string) {
  return className[0].toLowerCase() + className.substring(1);
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

export function getAppSplashscreen() {
  const app = getAppInstance();
  if (!app) return null;
  const root = (app as TiniApp).renderRoot;
  return (
    root.querySelector(APP_SPLASHSCREEN) ||
    root.querySelector(`#${APP_SPLASHSCREEN_ID}`)
  );
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
