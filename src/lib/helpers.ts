import {NO_APP_ERROR} from './consts';

export function getAppInstance() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app = document.querySelector('app-root') as any;
  if (!app) throw NO_APP_ERROR;
  return app;
}
