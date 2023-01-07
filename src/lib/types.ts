/* eslint-disable @typescript-eslint/no-explicit-any */
import {LitElement} from 'lit';
import {COMPONENT_TYPES} from './consts';

export interface AppOptions {
  splashscreen?: 'auto' | 'manual';
  navIndicator?: boolean;
}

export type TiniComponentType = COMPONENT_TYPES;

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

export interface GlobalInstance {
  $tiniDIRegistry?: DIRegistry;
  $tiniAppOptions?: AppOptions;
  $tiniConfigs?: Record<string, unknown>;
  $tiniRouter?: any;
  $tiniStore?: any;
  [key: string]: unknown;
}

export type TiniApp = TiniComponentInstance & {
  $options?: AppOptions;
  $configs?: Record<string, unknown>;
  $router?: any;
  $store?: any;
};
export type Global = GlobalInstance;

export type TiniComponentInstance = Omit<TiniComponentChild, 'constructor'>;

export type TiniComponentChild = TiniComponentInterface & LitElementInterface;

export type LifecycleHook = void | Promise<void>;

export interface OnCreate {
  onCreate(): LifecycleHook;
}
export interface OnInit {
  onInit(): LifecycleHook;
}
export interface OnChanges {
  onChanges(): LifecycleHook;
}
export interface OnRenders {
  onRenders(): LifecycleHook;
}
export interface OnReady {
  onReady(): LifecycleHook;
}
export interface OnChildrenReady {
  onChildrenReady(): LifecycleHook;
}
export interface OnDestroy {
  onDestroy(): LifecycleHook;
}
export interface TiniComponentInterface {
  // meta
  _pendingDI?: Array<() => Promise<unknown>>;
  // default
  componentType: TiniComponentType;
  constructor: () => void;
  childrenFirstUpdated(): LifecycleHook;
  // custom/alias hooks
  onCreate?(): LifecycleHook;
  onInit?(): LifecycleHook;
  onChanges?(): LifecycleHook;
  onRenders?(): LifecycleHook;
  onReady?(): LifecycleHook;
  onChildrenReady?(): LifecycleHook;
  onDestroy?(): LifecycleHook;
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
) => void;
