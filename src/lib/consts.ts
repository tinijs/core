import {GLOBAL_TINI as BASE_GLOBAL_TINI} from 'tinijs';

import {DIRegistry, LHRegistry, AppContext} from './types';
import {TiniComponent} from './main';

export const MODULE_NAME = 'core';
export const MODULE_ID = `tini:${MODULE_NAME}`;

export const GLOBAL_TINI = BASE_GLOBAL_TINI as typeof BASE_GLOBAL_TINI & {
  DIRegistry?: DIRegistry;
  LHRegistry?: LHRegistry;
  app?: TiniComponent;
};
export const TINI_APP_CONTEXT = ((
  GLOBAL_TINI as Record<string, unknown>
).appContext ||= {}) as AppContext<Record<string, unknown>>;

export const APP_ROOT = 'app-root';
export const SPLASHSCREEN_ID = 'splashscreen';

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
  OnDestroy = 'onDestroy',
  OnInit = 'onInit',
  OnReady = 'onReady',
  OnChanges = 'onChanges',
  OnFirstRender = 'onFirstRender',
  OnRenders = 'onRenders',
  OnChildrenRender = 'onChildrenRender',
  OnChildrenReady = 'onChildrenReady',
}

export enum RenderStatuses {
  Loading = 'loading',
  Empty = 'empty',
  Error = 'error',
  Fulfilled = 'fulfilled',
}
