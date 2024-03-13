import {resolve} from 'pathe';
import {existsSync} from 'node:fs';
import {Promisable} from 'type-fest';

import {TiniApp, TiniConfig} from '../classes/tini-app.js';

export interface ModuleMeta {
  name: string;
}

export interface ModuleInit {
  copy?: Record<string, string>;
  scripts?: Record<string, string>;
  buildCommand?: string;
  run?: string | (() => Promisable<void>);
}

export interface ModuleConfig<ModuleOptions> {
  meta: ModuleMeta;
  init?: (tiniConfig: TiniConfig) => ModuleInit;
  defaults?: ModuleOptions;
  setup?: (options: ModuleOptions, tini: TiniApp) => Promisable<void>;
}

export function defineTiniModule<ModuleOptions>(
  config: ModuleConfig<ModuleOptions>
) {
  return config;
}

export async function loadModule<ModuleOptions = any>(
  packageName: string,
  customDir?: string
) {
  const moduleEntryFilePath = customDir
    ? resolve(customDir)
    : resolve('node_modules', packageName, 'module', 'index.js');
  if (!existsSync(moduleEntryFilePath)) return null;
  const {default: tiniModule} = await import(moduleEntryFilePath);
  return tiniModule as ModuleConfig<ModuleOptions>;
}
