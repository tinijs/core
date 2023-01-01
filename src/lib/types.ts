/* eslint-disable @typescript-eslint/no-explicit-any */
import {LitElement} from 'lit';

export type ComponentConstruct = (target: any) => any;

export interface DependencyProvider {
  provider: () => Promise<any>;
  deps?: string[];
}

export type GlobalInstance = Record<string, any>;

export type TiniComponentInstance = Omit<TiniComponentChild, 'constructor'>;

export type TiniComponentChild = TiniComponentInterface & LitElementInterface;

export interface TiniComponentInterface {
  $_pendingDependencies?: Array<() => Promise<unknown>>;
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
