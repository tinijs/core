/* eslint-disable @typescript-eslint/no-explicit-any */
import {PropertyValues, TemplateResult, nothing} from 'lit';
import {ThemingOptions, RegisterComponentsList, UIOptions} from 'tinijs';

import {TINI_APP_CONTEXT, ComponentTypes, LifecycleHooks} from './consts';
import {TiniComponent} from './main';
import {Watching} from './watch';

export interface AppContext<AppConfigs extends Record<string, unknown>> {
  options?: AppOptions;
  configs?: AppConfigs;
}

export interface AppOptions {
  components?: RegisterComponentsList;
  uiOptions?: UIOptions;
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
  deps?: string[];
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
