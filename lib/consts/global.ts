import {CSSResultOrNative} from 'lit';

import {DIRegistry, LHRegistry, AppContext} from '../types.js';
import {TiniComponent} from '../main.js';
import {UIOptions} from '../utils/ui.js';
import {ActiveTheme} from '../utils/theme.js';

export const GLOBAL_TINI = ((globalThis as Record<string, unknown>).TiniJS ||=
  {}) as {
  activeTheme?: ActiveTheme;
  uiOptions?: UIOptions;
  cachedGenericStyles?: Record<string, undefined | CSSResultOrNative[]>;
  cachedGenericUnscopedStyles?: Record<string, undefined | string[]>;
  DIRegistry?: DIRegistry;
  LHRegistry?: LHRegistry;
  app?: TiniComponent;
};

export const TINI_APP_CONTEXT = ((
  GLOBAL_TINI as Record<string, unknown>
).appContext ||= {}) as AppContext<
  Record<string, unknown>,
  Record<string, unknown>
>;
