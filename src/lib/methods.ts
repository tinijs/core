/* eslint-disable @typescript-eslint/no-explicit-any */
import {GLOBAL, APP_ROOT, NO_APP_ERROR} from './consts';
import {TiniApp, Global, DIRegistry} from './types';

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
