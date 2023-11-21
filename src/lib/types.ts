/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Constructor,
  LitElementInterface,
  ThemingSubscription,
  ThemingOptions,
  UseComponentsList,
  GlobalComponentOptions,
} from 'tinijs';

import {ComponentTypes, LifecycleHooks} from './consts';

export interface Global {
  DIRegistry?: DIRegistry;
  LHRegistry?: LHRegistry;
  themingSubscriptions?: Map<symbol, ThemingSubscription>;
  app?: null | TiniApp;
}

export type TiniApp = TiniComponentInstance & {
  options?: AppOptions;
  configs?: Record<string, unknown>;
  workbox?: any;
  meta?: any;
  router?: any;
};

export interface AppOptions {
  providers?: DependencyProviders;
  splashscreen?: 'auto' | 'manual';
  navIndicator?: boolean;
  globalComponentOptions?: GlobalComponentOptions;
}

export interface ComponentOptions<Themes extends string> {
  name?: string;
  type?: ComponentTypes;
  components?: UseComponentsList;
  theming?: ThemingOptions<Themes>;
}

export interface TiniComponentInterface {
  // meta
  pendingDI?: Array<() => Promise<unknown>>;
  // default
  constructorName: string;
  componentType: ComponentTypes;
  constructor: () => void;
  childrenFirstUpdated(): void;
  // custom/alias hooks
  onCreate?(): void;
  onInit?(): void | Promise<void>;
  onChanges?(changedProperties: any): void;
  onRenders?(): void;
  onReady?(): void;
  onChildrenReady?(): void;
  onDestroy?(): void;
  // others
  metas?: Record<string, any>;
}

export type TiniComponentDerived = LitElementInterface & TiniComponentInterface;
export type TiniComponentConstructor = Constructor<TiniComponentDerived>;
export type TiniComponentInstance = Omit<TiniComponentDerived, 'constructor'>;

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

export type GlobalLifecycleHook = (
  component: TiniComponentInstance,
  global: Global
) => void;
export type LHRegistry = Record<
  ComponentTypes,
  Record<LifecycleHooks, GlobalLifecycleHook[]>
>;

export type ObserverCallback<Value> = (newVal: Value, oldVal: Value) => void;

export type ObservableSubscribe<Value> = (
  cb: ObserverCallback<Value>
) => ObservableUnsubscribe<Value>;

export type ObservableUnsubscribe<Value> = () => ObserverCallback<Value>;

export interface AppSplashscreenComponent extends HTMLElement {
  hide?(): void;
}

export interface OnCreate {
  onCreate(): void;
}
export interface OnInit {
  onInit(): void | Promise<void>;
}
export interface OnChanges {
  onChanges(): void;
}
export interface OnRenders {
  onRenders(): void;
}
export interface OnReady {
  onReady(): void;
}
export interface OnChildrenReady {
  onChildrenReady(): void;
}
export interface OnDestroy {
  onDestroy(): void;
}
