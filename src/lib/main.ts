import {LitElement, PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';

import {
  OnCreate,
  OnDestroy,
  OnInit,
  OnReady,
  OnChanges,
  OnFirstRender,
  OnRenders,
  OnChildrenRender,
  OnChildrenReady,
} from './types';
import {LifecycleHooks} from './consts';
import {runGlobalHooks} from './methods';

export const Input = property;
export const Reactive = state;

export class TiniComponent extends LitElement {
  static readonly defaultTagName: string = 'tini-component';
  static readonly componentName: string = 'unnamed';
  static readonly componentType: string = 'component';

  private initialized = false;
  private pendingDependencies?: Array<() => Promise<unknown>>;
  private storeManager?: {
    pending: Array<[any, string, string]>;
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
    runGlobalHooks(LifecycleHooks.OnChanges, this);
    (this as typeof this & OnChanges).onChanges?.(changedProperties);
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>) {
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
    if (onInit?.then)
      onInit.then(() => {
        runGlobalHooks(LifecycleHooks.OnReady, this);
        (this as unknown as OnReady).onReady?.();
      });
    // continue
    super.scheduleUpdate();
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
    this.storeManager.pending.forEach(([store, stateKey, propertyName]) => {
      const unsubscribe = store.subscribe(
        stateKey,
        (value: unknown) => ((this as any)[propertyName] = value)
      );
      unsubscribes.push(unsubscribe);
    });
  }

  private unsubscribeStore() {
    if (!this.storeManager?.unsubscribes?.length) return;
    this.storeManager.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.storeManager.unsubscribes = [];
  }
}
