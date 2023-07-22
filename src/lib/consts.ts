import {GlobalInstance} from './types';

export const GLOBAL = window as unknown as GlobalInstance;

export const enum ComponentTypes {
  App = 'app',
  Layout= 'layout',
  Page = 'page',
  Component = 'component',
}

export const enum LifecycleHooks {
  OnCreate = 'onCreate',
  OnInit = 'onInit',
  OnChanges = 'onChanges',
  OnRenders = 'onRenders',
  OnReady = 'onReady',
  OnChildrenReady = 'onChildrenReady',
  OnDestroy = 'onDestroy',
}

export const APP_ROOT = 'app-root';
export const APP_SPLASHSCREEN_ID = 'splashscreen';

export const NO_APP_ERROR = new Error('No TiniJS app available.');
export const NO_REGISTER_ERROR = (id: string) =>
  new Error(`No register for the dependency "${id}".`);
