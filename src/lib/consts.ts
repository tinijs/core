import {html} from 'lit';
import {GlobalInstance} from './types';

export const GLOBAL = window as unknown as GlobalInstance;
export const APP_ROOT = 'app-root';
export const ROUTER_OUTLET = 'router-outlet';
export const APP_ROOT_TEMPLATE = html`<div id="${ROUTER_OUTLET}"></div>`;
export const NO_APP_ERROR = new Error('No TiniJS app available.');
export const NO_REGISTER_ERROR = (id: string) =>
  new Error(`No register for the dependency "${id}".`);
