/* eslint-disable @typescript-eslint/no-explicit-any */
import {LitElement} from 'lit';
import {COMPONENT_TYPES, LIFECYCLE_HOOKS} from './consts';

export interface AppOptions {
  splashscreen?: 'auto' | 'manual';
  navIndicator?: boolean;
}

export type TiniComponentType = COMPONENT_TYPES;
export type TiniLifecycleHook = LIFECYCLE_HOOKS;

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
  onChanges?(): void;
  onRenders?(): void;
  onReady?(): void;
  onChildrenReady?(): void;
  onDestroy?(): void;
}

export type LitElementInterface = LitElement;

export type TiniComponentConstructor = Constructor<LitElementInterface> &
  Constructor<TiniComponentInterface>;

export type Constructor<T = {}> = new (...args: ConstructorArgs) => T;
export type ConstructorArgs = any[];

export interface AppSplashscreenComponent extends HTMLElement {
  hide?(): void;
}

export type ObservableSubscription<Value> = (
  newVal: Value,
  oldVal: Value
) => void;

export type ObservableChanged<Value> = (
  subscription: ObservableSubscription<Value>
) => ObservableUnsubscribe<Value>;

export type ObservableUnsubscribe<Value> = () => ObservableSubscription<Value>;
