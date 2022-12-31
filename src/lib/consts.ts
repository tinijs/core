import {html} from 'lit';
import {GlobalInstance} from './types';

export const GLOBAL = document as GlobalInstance;
export const APP_ROOT = 'app-root';
export const ROUTER_OUTLET = 'router-outlet';
export const APP_ROOT_TEMPLATE = html`<div id="${ROUTER_OUTLET}"></div>`;
export const NO_APP_ERROR = new Error('No TiniJS app available.');
