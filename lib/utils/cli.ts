import {SubCommandsDef} from 'citty';
import {Promisable} from 'type-fest';

import {TiniProject, TiniIntegrationMeta} from '../classes/tini-project.js';

export interface CliExpansionConfig<
  Options extends Record<string, unknown> = {},
> {
  meta: TiniIntegrationMeta;
  setup: (options: Options, tini: TiniProject) => Promisable<SubCommandsDef>;
  defaults?: Options;
}
