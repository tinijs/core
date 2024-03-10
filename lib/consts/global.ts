import {CSSResultOrNative} from 'lit';

import { UIOptions } from '../utils/ui';
import { ActiveTheme } from '../utils/theme';

export const GLOBAL_TINI = ((globalThis as Record<string, unknown>).TiniJS ||=
  {}) as {
  activeTheme?: ActiveTheme;
  uiOptions?: UIOptions;
  cachedGenericStyles?: Record<string, undefined | CSSResultOrNative[]>;
  cachedGenericUnscopedStyles?: Record<string, undefined | string[]>;
};
