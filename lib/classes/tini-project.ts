import {HookCallback, createHooks} from 'hookable';
import {ProxifiedModule, loadFile, writeFile} from 'magicast';
import {CheerioAPI} from 'cheerio';
import {defu} from 'defu';
import initJiti, {JITI} from 'jiti';
import {resolve} from 'pathe';
import {pathExistsSync} from 'fs-extra/esm';

import {GLOBAL_TINI} from '../consts/global.js';
import {ModuleConfig, setupModules} from '../utils/module.js';
import {CliExpansionConfig} from '../utils/cli.js';

// @ts-ignore
const jiti = initJiti(import.meta.url) as JITI;

export interface TiniIntegrationMeta {
  name: string;
}

export type TiniIntegration<
  Local,
  Options extends Record<string, unknown> = {},
> = Array<string | Local | [string | Local, Options?]>;

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
export type TiniConfigCustomPrebuild = (tiniProject: TiniProject) => Prebuilder;

export enum OfficialBuilders {
  Parcel = 'parcel',
  Vite = 'vite',
  Webpack = 'webpack',
}
export interface TiniConfigBuild {
  builder?: OfficialBuilders;
  options?: Record<string, any>;
}
export type TiniConfigCustomBuild = (tiniProject: TiniProject) => Builder;

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
export interface RuntimeHooks {
  'app:foo': () => ReturnType<HookCallback>;
}
export interface TiniConfigHooks
  extends CliHooks,
    PrebuildHooks,
    BuildHooks,
    RuntimeHooks {}

export type TiniConfigModules = TiniIntegration<ModuleConfig>;

export interface CliGenerateOptions {
  componentPrefix?: string;
  generators?: Record<string, any>;
}
export interface TiniConfigCli {
  docs?: false;
  new?: false;
  dev?: false;
  generate?: false | CliGenerateOptions;
  build?: false;
  preview?: false;
  module?: false;
  expand?: TiniIntegration<CliExpansionConfig>;
}

export interface TiniConfigUi {
  sources: string[];
  pick: {
    families: Record<
      string,
      {
        skins: string[];
      }
    >;
    bases: string[];
  };
  icons?: Array<
    | string
    | {
        dir: string;
        subs?: Array<string | {name: string; suffix?: boolean | string}>;
        transform?: () => any;
      }
  >;
  outDir?: string;
  react?: boolean;
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
  ui?: TiniConfigUi;
}

export async function getTiniProject(): Promise<TiniProject> {
  console.log('getTiniProject()');

  return (GLOBAL_TINI.tiniProject ||= await defineTiniProject(
    await loadConfig()
  ));
}

async function defineTiniProject(config: TiniConfig) {
  console.log('defineTiniProject()');

  const tiniProject = new TiniProject(config);
  // setup modules
  await setupModules(tiniProject);
  // add hooks
  if (tiniProject.config.hooks) {
    tiniProject.hooks.addHooks(tiniProject.config.hooks);
  }
  // result
  return tiniProject;
}

export function defineTiniConfig(config: Partial<TiniConfig>) {
  return config;
}

function getConfigFilePath() {
  const tsFile = 'tini.config.ts';
  const jsFile = 'tini.config.js';
  const tsFilePath = resolve(tsFile);
  const jsFilePath = resolve(jsFile);
  const configFilePath = pathExistsSync(tsFilePath)
    ? tsFilePath
    : pathExistsSync(jsFilePath)
    ? jsFilePath
    : null;
  return configFilePath;
}

async function loadConfig() {
  const defaultConfig: TiniConfig = {
    srcDir: 'app',
    outDir: 'www',
    tempDir: '.tini',
  };
  const configFilePath = getConfigFilePath();
  if (!configFilePath) {
    return defaultConfig;
  }
  const {default: fileConfig = {}} = (await jiti.import(
    configFilePath,
    {}
  )) as {
    default?: TiniConfig;
  };
  return defu(defaultConfig, fileConfig);
}

export async function modifyTiniConfigFile(
  modifier: (
    proxifiedModule: ProxifiedModule<TiniConfig>
  ) => Promise<ProxifiedModule<TiniConfig>>
) {
  const configFilePath = getConfigFilePath();
  if (!configFilePath) {
    throw new Error('No Tini config file available in the current project.');
  }
  const proxifiedModule = await modifier(
    await loadFile<TiniConfig>(configFilePath)
  );
  return writeFile(proxifiedModule, configFilePath);
}

export class TiniProject {
  constructor(public readonly config: TiniConfig) {}

  readonly hooks = createHooks<TiniConfigHooks>();
  readonly hook = this.hooks.hook;
}
