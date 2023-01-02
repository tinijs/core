/* eslint-disable @typescript-eslint/no-explicit-any */
import {LitElement} from 'lit';

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
  $tiniConfigs?: Record<string, unknown>;
  $tiniRouter?: any;
  $tiniStore?: any;
  [key: string]: unknown;
}

export type TiniApp = TiniComponentInstance;
export type Global = GlobalInstance;

export type TiniComponentInstance = Omit<TiniComponentChild, 'constructor'>;

export type TiniComponentChild = TiniComponentInterface & LitElementInterface;

export interface TiniComponentInterface {
  _pendingDI?: Array<() => Promise<unknown>>;
  $configs?: Record<string, unknown>;
  $router?: any;
  $store?: any;
  constructor: () => void;
  onCreate?(): void | Promise<void>;
  onInit?(): void | Promise<void>;
  onChanges?(): void | Promise<void>;
  onRender?(): void | Promise<void>;
  onReady?(): void | Promise<void>;
  onDestroy?(): void | Promise<void>;
}

export type LitElementInterface = LitElement;

export type TiniComponentConstructor = Constructor<LitElementInterface> &
  Constructor<TiniComponentInterface>;

export type Constructor<T = {}> = new (...args: ConstructorArgs) => T;
export type ConstructorArgs = any[];
