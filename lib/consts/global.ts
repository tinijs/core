import {CSSResultOrNative} from 'lit';

import {TiniProject} from '../classes/tini-project.js';
import {
  TiniComponent,
  DIRegistry,
  LHRegistry,
  AppOptions,
} from '../classes/tini-component.js';
import {UIManager} from '../classes/ui-manager.js';

export const GLOBAL_TINI = ((globalThis as Record<string, unknown>).TiniJS ||=
  {}) as {
  cachedGenericStyles?: Record<string, undefined | CSSResultOrNative[]>;
  cachedGenericUnscopedStyles?: Record<string, undefined | string[]>;
  DIRegistry?: DIRegistry;
  LHRegistry?: LHRegistry;
  ui?: UIManager;
  clientApp?: {
    rootElement: TiniComponent;
    options?: AppOptions;
    configs?: Record<string, unknown>;
  };
  tiniProject?: TiniProject;
};
