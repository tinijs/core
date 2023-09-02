import {GLOBAL_TINI} from 'tinijs';
import {Global} from './types';

export const MODULE_NAME = 'core';
export const MODULE_ID = `tini:${MODULE_NAME}`;

export const GLOBAL = GLOBAL_TINI as Global;
export const APP_ROOT = 'app-root';
export const APP_SPLASHSCREEN_ID = 'splashscreen';

export const NO_APP_ERROR = new Error('No TiniJS app available.');
export const NO_REGISTER_ERROR = (id: string) =>
  new Error(`No register for the dependency "${id}".`);

export enum ComponentTypes {
  App = 'app',
  Layout = 'layout',
  Page = 'page',
  Component = 'component',
}

export enum LifecycleHooks {
  OnCreate = 'onCreate',
  OnInit = 'onInit',
  OnChanges = 'onChanges',
  OnRenders = 'onRenders',
  OnReady = 'onReady',
  OnChildrenReady = 'onChildrenReady',
  OnDestroy = 'onDestroy',
}
