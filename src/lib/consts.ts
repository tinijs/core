import {html} from 'lit';
import {GlobalInstance} from './types';

export const GLOBAL = window as unknown as GlobalInstance;
export const enum COMPONENT_TYPES {
  APP = 'app',
  LAYOUT = 'layout',
  PAGE = 'page',
  COMPONENT = 'component',
}
export const enum LIFECYCLE_HOOKS {
  ON_CREATE = 'onCreate',
  ON_INIT = 'onInit',
  ON_CHANGES = 'onChanges',
  ON_RENDERS = 'onRenders',
  ON_READY = 'onReady',
  ON_CHILDREN_READY = 'onChildrenReady',
  ON_DESTROY = 'onDestroy',
}

export const APP_ROOT = 'app-root';
export const ROUTER_OUTLET_ID = 'router-outlet';
export const APP_ROOT_TEMPLATE = html`<div id="${ROUTER_OUTLET_ID}"></div>`;

export const APP_SPLASHSCREEN_ID = 'splashscreen';

export const NO_APP_ERROR = new Error('No TiniJS app available.');
export const NO_REGISTER_ERROR = (id: string) =>
  new Error(`No register for the dependency "${id}".`);
