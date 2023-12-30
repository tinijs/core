/* eslint-disable @typescript-eslint/no-explicit-any */
import {PropertyValues} from 'lit';
import {ThemingOptions, RegisterComponentsList, UIOptions} from 'tinijs';

import {TINI_APP_CONTEXT, ComponentTypes, LifecycleHooks} from './consts';
import {TiniComponent} from './main';

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

export type ObserverCallback<Value> = (
  newValue: Value,
  oldValue: Value
) => void;
export type ObservableSubscribe<Value> = (
  callback: ObserverCallback<Value>
) => ObservableUnsubscribe<Value>;
export type ObservableUnsubscribe<Value> = () => ObserverCallback<Value>;

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
  onCreate(): void; // connectedCallback
}
export interface OnInit {
  onInit(): void | Promise<void>;
}
export interface OnReady {
  onReady(changedProperties: PropertyValues<unknown>): void; // firstUpdated
}
export interface OnChildrenReady {
  onChildrenReady(): void;
}
export interface OnChanges {
  onChanges(changedProperties: PropertyValues<unknown>): void; // willUpdate
}
export interface OnRenders {
  onRenders(changedProperties: PropertyValues<unknown>): void; // updated
}
export interface OnDestroy {
  onDestroy(): void; // disconnectedCallback
}
