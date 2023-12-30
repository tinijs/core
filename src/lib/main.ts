import {LitElement, PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';

import {
  OnCreate,
  OnDestroy,
  OnInit,
  OnChanges,
  OnRenders,
  OnReady,
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

  private pendingDependencies: Array<() => Promise<unknown>> = [];

  connectedCallback() {
    super.connectedCallback();
    // run hooks
    runGlobalHooks(LifecycleHooks.OnCreate, this);
    (this as typeof this & OnCreate).onCreate?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // run hooks
    runGlobalHooks(LifecycleHooks.OnDestroy, this);
    (this as typeof this & OnDestroy).onDestroy?.();
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
    if (children.length) {
      const childUpdatedPromises = Array.from(children)
        .filter(item => !!item?.childrenFirstUpdated)
        .map(item => {
          let resolveSchedule = () => {};
          const originalchildrenFirstUpdated = item.childrenFirstUpdated;
          item.childrenFirstUpdated = () => {
            originalchildrenFirstUpdated.apply(item);
            resolveSchedule();
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return new Promise(resolve => (resolveSchedule = resolve as any));
        });
      Promise.all(childUpdatedPromises).then(() => this.childrenFirstUpdated());
    } else {
      this.childrenFirstUpdated();
    }
    // run hooks
    runGlobalHooks(LifecycleHooks.OnReady, this);
    (this as typeof this & OnReady).onReady?.(changedProperties);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    runGlobalHooks(LifecycleHooks.OnRenders, this);
    (this as typeof this & OnRenders).onRenders?.(changedProperties);
  }

  private childrenFirstUpdated() {
    runGlobalHooks(LifecycleHooks.OnChildrenReady, this);
    (this as typeof this & OnChildrenReady).onChildrenReady?.();
  }

  protected override async scheduleUpdate() {
    const digest = async () => {
      this.pendingDependencies = []; // marked as resolved
      // run hooks
      await (this as typeof this & OnInit).onInit?.();
      runGlobalHooks(LifecycleHooks.OnInit, this);
      // continue
      super.scheduleUpdate();
    };
    // resolve dependencies
    if (this.pendingDependencies.length) {
      for (let i = 0; i < this.pendingDependencies.length; i++) {
        await this.pendingDependencies[i]();
      }
      await digest();
    } else {
      await digest();
    }
  }
}
