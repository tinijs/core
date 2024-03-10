/* eslint-disable @typescript-eslint/no-explicit-any */
import {PropertyValues, TemplateResult, nothing} from 'lit';

import {TINI_APP_CONTEXT} from './consts/global.js';
import {RegisterComponentsList} from './utils/components.js';
import {ThemingOptions} from './utils/theme.js';
import {UIOptions} from './utils/ui.js';
import {ComponentTypes, LifecycleHooks} from './consts.js';
import {TiniComponent} from './main.js';
import {Watching} from './watch.js';

export interface AppContext<
  AppConfigs extends Record<string, unknown>,
  ExtendedUIOptions extends Record<string, unknown> = {},
> {
  options?: AppOptions<ExtendedUIOptions>;
  configs?: AppConfigs;
}

export interface AppOptions<
  ExtendedUIOptions extends Record<string, unknown> = {},
> {
  components?: RegisterComponentsList;
  uiOptions?: UIOptions<ExtendedUIOptions>;
  providers?: DependencyProviders;
  splashscreen?: 'auto' | 'manual';
  navIndicator?: boolean;
}

export interface ComponentOptions<ThemeId extends string> {
  name?: string;
  type?: ComponentTypes;
  components?: RegisterComponentsList;
  theming?: ThemingOptions<ThemeId>;
}

export type DependencyProvider = () => Promise<any>;
export interface DependencyDef {
  provider: DependencyProvider;
  deps?: (string | (() => unknown))[];
}
export type DependencyProviders = Record<
  string,
  DependencyProvider | DependencyDef
>;
export interface DIRegistry {
  registers: Map<string, () => Promise<any>>;
  instances: Map<string, any>;
  awaiters: Array<() => any>;
}

export type GlobalLifecycleHook = (data: {
  source: TiniComponent;
  app: TiniComponent;
  appContext: typeof TINI_APP_CONTEXT;
}) => void;
export type LHRegistry = Record<
  ComponentTypes,
  Record<LifecycleHooks, GlobalLifecycleHook[]>
>;

export type Watcher = Watching['watch'];
export type WatchableHandler<Value> = (
  callback: WatchableCallback<Value>
) => Unwatch;
export type WatchableCallback<Value> = (
  newValue: Value,
  oldValue: Value
) => void;
export type Unwatch = () => void;

export interface SplashscreenComponent extends HTMLElement {
  hide?(): void;
}

export interface AppWithOptions {
  options: AppOptions;
}

export interface AppWithConfigs<AppConfigs extends Record<string, unknown>> {
  configs: AppConfigs;
}

export interface OnCreate {
  onCreate(): void; // connectedCallback()
}
export interface OnDestroy {
  onDestroy(): void; // disconnectedCallback()
}
export interface OnInit {
  onInit(): void | Promise<void>;
}
export interface OnReady {
  onReady(): void;
}
export interface OnChanges {
  onChanges(changedProperties: PropertyValues<unknown>): void; // willUpdate()
}
export interface OnFirstRender {
  onFirstRender(changedProperties: PropertyValues<unknown>): void; // firstUpdated()
}
export interface OnRenders {
  onRenders(changedProperties: PropertyValues<unknown>): void; // updated()
}
export interface OnChildrenRender {
  onChildrenRender(): void; // children first render
}
export interface OnChildrenReady {
  onChildrenReady(): void;
}

export type RenderData<Type> = Type | null | undefined;
export type RenderDataOrError<Type> = RenderData<Type> | Error;
export interface RenderTemplates<Template = TemplateResult | typeof nothing> {
  loading?: () => Template;
  empty?: () => Template;
  error?: (dependencies: RenderDataOrError<unknown>[]) => Template;
  main: (dependencies: RenderDataOrError<unknown>[]) => Template;
}
