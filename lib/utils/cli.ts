import {SubCommandsDef} from 'citty';
import {Promisable} from 'type-fest';

import {TiniApp, ConfigIntegrationMeta} from '../classes/tini-app.js';

export interface CliExpansionConfig<
  Options extends Record<string, unknown> = {},
> {
  meta: ConfigIntegrationMeta;
  setup: (options: Options, tini: TiniApp) => Promisable<SubCommandsDef>;
  defaults?: Options;
}
