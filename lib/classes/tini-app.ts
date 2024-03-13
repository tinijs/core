import {createHooks, HookCallback} from 'hookable';
import {defu} from 'defu';
import {loadConfig} from 'c12';
import {Promisable} from 'type-fest';
import {ProxifiedModule, loadFile, writeFile} from 'magicast';
import {CheerioAPI} from 'cheerio';

import {loadModule} from '../utils/module.js';

export interface Prebuilder {
  build: () => Promise<void>;
  buildFile: (path: string) => Promise<void>;
}

export interface Builder {
  dev:
    | (() => Promise<void>)
    | {
        command: string;
        onServerStart?: () => void;
      };
  build:
    | (() => Promise<void>)
    | {
        command: string;
      };
}

export interface TiniConfigDirs {
  assets?: string;
  configs?: string;
  consts?: string;
  classes?: string;
  components?: string;
  layouts?: string;
  pages?: string;
  partials?: string;
  services?: string;
  utils?: string;
  stores?: string;
  types?: string;
  public?: string;
  vendor?: string;
}

export enum OfficialPrebuilders {
  Default = 'default',
}
export interface TiniConfigPrebuild {
  prebuilder?: OfficialPrebuilders;
  options?: Record<string, any>;
}
export type TiniConfigCustomPrebuild = (tiniApp: TiniApp) => Prebuilder;

export enum OfficialBuilders {
  Parcel = 'parcel',
  Vite = 'vite',
  Webpack = 'webpack',
}
export interface TiniConfigBuild {
  builder?: OfficialBuilders;
  options?: Record<string, any>;
}
export type TiniConfigCustomBuild = (tiniApp: TiniApp) => Builder;

export interface CliHooks {
  'cli:setup': () => ReturnType<HookCallback>;
  'cli:cleanup': () => ReturnType<HookCallback>;
}
export interface PrebuildFileHookContext {
  base: string;
  inPath: string;
  outPath: string;
  html?: CheerioAPI;
  jts?: ProxifiedModule;
}
export interface PrebuildHooks {
  'prebuild:before': () => ReturnType<HookCallback>;
  'prebuild:beforeFile': (
    context: PrebuildFileHookContext
  ) => ReturnType<HookCallback>;
  'prebuild:afterFile': (
    context: PrebuildFileHookContext
  ) => ReturnType<HookCallback>;
  'prebuild:after': () => ReturnType<HookCallback>;
}
export interface BuildHooks {
  'build:before': () => ReturnType<HookCallback>;
  'build:after': () => ReturnType<HookCallback>;
}
export interface RuntimeHooks {}
export interface TiniConfigHooks
  extends CliHooks,
    PrebuildHooks,
    BuildHooks,
    RuntimeHooks {}

export type TiniConfigModules = Array<
  string | [string, any?] | ((tini: TiniApp) => Promisable<void>)
>;

export interface CliDocsOptions {}
export interface CliNewOptions {}
export interface CliDevOptions {}
export interface CliBuildOptions {}
export interface CliPreviewOptions {}
export interface CliModuleOptions {}
export interface CliGenerateOptions {
  componentPrefix?: string;
  generators?: Record<string, any>;
}
export interface CliCleanOptions {}
export interface CliExpandOptions {}
export interface TiniConfigCli {
  docs?: false | CliDocsOptions;
  new?: false | CliNewOptions;
  dev?: false | CliDevOptions;
  build?: false | CliBuildOptions;
  preview?: false | CliPreviewOptions;
  module?: false | CliModuleOptions;
  generate?: false | CliGenerateOptions;
  clean?: false | CliCleanOptions;
  expand?: Array<string | [string, CliExpandOptions?]>;
}

export interface TiniConfig {
  srcDir: string;
  outDir: string;
  tempDir: string;
  dirs?: TiniConfigDirs;
  prebuild?: false | TiniConfigPrebuild | TiniConfigCustomPrebuild;
  build?: TiniConfigBuild | TiniConfigCustomBuild;
  hooks?: Partial<TiniConfigHooks>;
  modules?: TiniConfigModules;
  cli?: TiniConfigCli;
}

export const MAIN_TINI_CONFIG_FILE = 'tini.config.ts';

export async function getTiniApp() {
  return TiniApp.globalInstance || defineTiniApp();
}

export async function defineTiniApp(config?: TiniConfig) {
  const tini = new TiniApp(config || (await loadRawConfig()));
  // setup modules
  if (tini.config.modules) {
    for (const configModule of tini.config.modules) {
      if (configModule instanceof Function) {
        await configModule(tini);
      } else {
        const [packageName, moduleOptions] = !Array.isArray(configModule)
          ? [configModule]
          : configModule;
        const tiniModule = await loadModule(packageName);
        await tiniModule?.setup?.(
          defu(tiniModule?.defaults, moduleOptions),
          tini
        );
      }
    }
  }
  // add hooks
  if (tini.config.hooks) {
    tini.hooks.addHooks(tini.config.hooks);
  }
  // result
  return tini;
}

export function defineTiniConfig(config: Partial<TiniConfig>) {
  return config;
}

async function loadRawConfig() {
  const loadResult = await loadConfig({
    name: 'tini',
    defaultConfig: {
      srcDir: 'app',
      outDir: 'www',
      tempDir: '.tini',
    },
  });
  return loadResult.config as TiniConfig;
}

export async function modifyTiniConfigFile(
  modifier: (
    mod: ProxifiedModule<TiniConfig>
  ) => Promise<ProxifiedModule<TiniConfig>>
) {
  const mod = await modifier(await loadFile<TiniConfig>(MAIN_TINI_CONFIG_FILE));
  return writeFile(mod, MAIN_TINI_CONFIG_FILE);
}

export class TiniApp {
  static globalInstance?: TiniApp;

  constructor(public config: TiniConfig) {}

  readonly hooks = createHooks<TiniConfigHooks>();
  readonly hook = this.hooks.hook;
}
