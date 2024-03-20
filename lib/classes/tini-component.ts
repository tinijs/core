import {PropertyValues} from 'lit';

import {Theming} from './ui-manager.js';
import {TiniElement} from './tini-element.js';

import {runGlobalHooks} from '../utils/app.js';
import {RegisterComponentsList} from '../utils/components.js';

export enum ComponentTypes {
  App = 'app',
  Layout = 'layout',
  Page = 'page',
  Component = 'component',
}

export enum LifecycleHooks {
  OnCreate = 'onCreate',
  OnDestroy = 'onDestroy',
  OnInit = 'onInit',
  OnReady = 'onReady',
  OnChanges = 'onChanges',
  OnFirstRender = 'onFirstRender',
  OnRenders = 'onRenders',
  OnChildrenRender = 'onChildrenRender',
  OnChildrenReady = 'onChildrenReady',
}

export interface ClientApp<AppRoot = TiniComponent> {
  rootElement: AppRoot;
  config?: Record<string, unknown>;
  options?: AppOptions;
}

export interface AppOptions {
  components?: RegisterComponentsList;
  providers?: DependencyProviders;
  splashscreen?: 'auto' | 'manual';
  navIndicator?: boolean;
}

export interface ComponentOptions {
  name?: string;
  type?: ComponentTypes;
  components?: RegisterComponentsList;
  theming?: Theming;
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
  clientApp: ClientApp;
}) => void;
export type LHRegistry = Record<
  ComponentTypes,
  Record<LifecycleHooks, GlobalLifecycleHook[]>
>;

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

export class TiniComponent extends TiniElement {
  static readonly componentType: string = 'component';

  private initialized = false;
  private pendingDependencies?: Array<() => Promise<unknown>>;
  private storeManager?: {
    pending: Array<[any, string, string, boolean]>;
    unsubscribes: Array<() => void>;
  };

  connectedCallback() {
    super.connectedCallback();
    // subscribe store
    this.subscribeStore();
    // run hooks
    runGlobalHooks(LifecycleHooks.OnCreate, this);
    (this as typeof this & OnCreate).onCreate?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // run hooks
    runGlobalHooks(LifecycleHooks.OnDestroy, this);
    (this as typeof this & OnDestroy).onDestroy?.();
    // unsubscribe store
    this.unsubscribeStore();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    runGlobalHooks(LifecycleHooks.OnChanges, this);
    (this as typeof this & OnChanges).onChanges?.(changedProperties);
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>) {
    super.firstUpdated(changedProperties);
    // process children rendering
    const root = this.shadowRoot as ShadowRoot;
    const children = root.querySelectorAll(
      '[await]'
    ) as unknown as TiniComponent[];
    if (!children.length) {
      this.childrenRender();
      this.childrenReady();
    } else {
      const childrenList = Array.from(children);
      this.getChildrenLifecyclePromise(childrenList, 'childrenRender').then(
        () => this.childrenRender()
      );
      this.getChildrenLifecyclePromise(childrenList, 'childrenReady').then(() =>
        this.childrenReady()
      );
    }
    // run hooks
    runGlobalHooks(LifecycleHooks.OnFirstRender, this);
    (this as typeof this & OnFirstRender).onFirstRender?.(changedProperties);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    runGlobalHooks(LifecycleHooks.OnRenders, this);
    (this as typeof this & OnRenders).onRenders?.(changedProperties);
  }

  private childrenRender() {
    runGlobalHooks(LifecycleHooks.OnChildrenRender, this);
    (this as typeof this & OnChildrenRender).onChildrenRender?.();
  }

  private childrenReady() {
    runGlobalHooks(LifecycleHooks.OnChildrenReady, this);
    (this as typeof this & OnChildrenReady).onChildrenReady?.();
  }

  protected override async scheduleUpdate() {
    // A: subsequent updates
    if (this.initialized) {
      super.scheduleUpdate();
    }
    // B: no dependencies
    else if (!this.pendingDependencies?.length) {
      this.digestDI();
    }
    // C: has dependencies
    else {
      for (let i = 0; i < this.pendingDependencies.length; i++) {
        await this.pendingDependencies[i]();
      }
      this.digestDI();
    }
  }

  private digestDI() {
    this.initialized = true;
    this.pendingDependencies = [];
    // run hooks
    runGlobalHooks(LifecycleHooks.OnInit, this);
    const onInit = (this as typeof this & OnInit).onInit?.();
    if (!onInit?.then) {
      this.digestOnInit();
    } else {
      onInit.then(() => this.digestOnInit());
    }
    // continue
    super.scheduleUpdate();
  }

  private digestOnInit() {
    setTimeout(() => {
      runGlobalHooks(LifecycleHooks.OnReady, this);
      (this as unknown as OnReady).onReady?.();
    }, 0);
  }

  private getChildrenLifecyclePromise(
    children: TiniComponent[],
    hookName: 'childrenRender' | 'childrenReady'
  ) {
    const promises = children
      .filter(item => !!item[hookName])
      .map(item => {
        let resolve = () => {};
        const original = item[hookName];
        item[hookName] = () => {
          original.call(item);
          resolve();
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Promise(r => (resolve = r as any));
      });
    return Promise.all(promises);
  }

  private subscribeStore() {
    if (!this.storeManager?.pending?.length) return;
    const unsubscribes = (this.storeManager.unsubscribes ||= []);
    this.storeManager.pending.forEach(
      ([store, stateKey, propertyName, reactive]) => {
        const unsubscribe = store.subscribe(stateKey, (value: unknown) => {
          (this as any)[propertyName] = value;
          if (reactive) this.requestUpdate();
        });
        unsubscribes.push(unsubscribe);
      }
    );
  }

  private unsubscribeStore() {
    if (!this.storeManager?.unsubscribes?.length) return;
    this.storeManager.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.storeManager.unsubscribes = [];
  }
}
