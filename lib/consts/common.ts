export const MODULE_NAME = 'core';
export const MODULE_ID = `tini:${MODULE_NAME}`;

export const APP_ROOT = 'app-root';
export const SPLASHSCREEN_ID = 'splashscreen';

export const NO_APP_ERROR = new Error('No TiniJS app available.');
export const NO_REGISTER_ERROR = (id: string) =>
  new Error(`No register for the dependency "${id}".`);
