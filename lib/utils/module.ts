import {resolve} from 'pathe';
import {pathExistsSync} from 'fs-extra/esm';
import {Promisable} from 'type-fest';
import {defu} from 'defu';

import {
  TiniApp,
  TiniConfig,
  ConfigIntegrationMeta,
} from '../classes/tini-app.js';

export interface ModuleInit {
  copy?: Record<string, string>;
  scripts?: Record<string, string>;
  buildCommand?: string;
  run?: string | (() => Promisable<void>);
}

export interface ModuleConfig<Options extends Record<string, unknown> = {}> {
  meta: ConfigIntegrationMeta;
  setup: (options: Options, tini: TiniApp) => Promisable<void>;
  init?: (tiniConfig: TiniConfig) => ModuleInit;
  defaults?: Options;
}

export function defineTiniModule<Options extends Record<string, unknown>>(
  config: ModuleConfig<Options>
) {
  return config;
}

export async function setupModules(tiniApp: TiniApp) {
  const modulesConfig = tiniApp.config.modules || [];
  for (const item of modulesConfig) {
    const [localOrVendor, options = {}] = item instanceof Array ? item : [item];
    const moduleConfig =
      localOrVendor instanceof Object
        ? localOrVendor
        : await loadVendorModule(localOrVendor);
    await moduleConfig?.setup(defu(moduleConfig.defaults, options), tiniApp);
  }
}

export async function loadVendorModule(packageName: string) {
  const entryPath = resolve(
    'node_modules',
    packageName,
    'dist',
    'module',
    'index.js'
  );
  if (!pathExistsSync(entryPath)) return null;
  const {default: defaulExport} = await import(entryPath);
  if (!defaulExport?.meta || !defaulExport?.setup) return null;
  return defaulExport as ModuleConfig;
}
