import {SubCommandsDef} from 'citty';
import {Promisable} from 'type-fest';

import {TiniApp} from '../classes/tini-app.js';

export interface CliExpansionMeta {
  name: string;
}

export interface CliExpansionConfig<
  Options extends Record<string, unknown> = {},
> {
  meta: CliExpansionMeta;
  setup: (options: Options, tini: TiniApp) => Promisable<SubCommandsDef>;
  defaults?: Options;
}
