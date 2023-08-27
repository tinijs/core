/* eslint-disable @typescript-eslint/no-explicit-any */
import {LitElement} from 'lit';
import {ThemingOptions, UseComponentsList} from 'tinijs';

import {ComponentTypes, LifecycleHooks} from './consts';

export interface AppOptions {
  providers?: DependencyProviders;
  splashscreen?: 'auto' | 'manual';
  navIndicator?: boolean;
}

export interface ComponentOptions<Themes extends string> {
  name?: string;
  type?: ComponentTypes;
  components?: UseComponentsList;
  theming?: ThemingOptions<Themes>;
}

export type TiniComponentType = ComponentTypes;
export type TiniLifecycleHook = LifecycleHooks;

export type ComponentConstruct = (target: any) => any;

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
export type LHRegistry = Record<
  TiniComponentType,
  Record<TiniLifecycleHook, GlobalLifecycleHook[]>
>;

export interface GlobalInstance {
  $tiniDIRegistry?: DIRegistry;
  $tiniLHRegistry?: LHRegistry;
  $tiniAppOptions?: AppOptions;
  $tiniThemingSubscriptions?: Map<symbol, ThemingSubscription>;
  $tiniConfigs?: Record<string, unknown>;
  $tiniWorkbox?: any;
  $tiniMeta?: any;
  $tiniRouter?: any;
  $tiniStore?: any;
  [key: string]: unknown;
}

export type TiniApp = TiniComponentInstance & {
  $options?: AppOptions;
  $configs?: Record<string, unknown>;
  $workbox?: any;
  $meta?: any;
  $router?: any;
  $store?: any;
};
export type Global = GlobalInstance;

export type TiniComponentInstance = Omit<TiniComponentChild, 'constructor'>;

export type TiniComponentChild = TiniComponentInterface & LitElementInterface;

export type GlobalLifecycleHook = (
  component: TiniComponentInstance,
  appOrGlobal: TiniApp | Global,
  appOptions?: AppOptions
) => void;

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
export interface TiniComponentInterface {
  // meta
  _pendingDI?: Array<() => Promise<unknown>>;
  // default
  componentType: TiniComponentType;
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

export type LitElementInterface = LitElement;

export type TiniComponentConstructor = Constructor<LitElementInterface> &
  Constructor<TiniComponentInterface>;

export type Constructor<T = {}> = new (...args: ConstructorArgs) => T;
export type ConstructorArgs = any[];

export interface AppSplashscreenComponent extends HTMLElement {
  hide?(): void;
}

export type ObserverCallback<Value> = (newVal: Value, oldVal: Value) => void;

export type ObservableSubscribe<Value> = (
  cb: ObserverCallback<Value>
) => ObservableUnsubscribe<Value>;

export type ObservableUnsubscribe<Value> = () => ObserverCallback<Value>;

export type ThemingSubscription = (soul: string) => void;
