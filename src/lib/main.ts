import {LitElement} from 'lit';
import {LifecycleHooks} from './consts';
import {
  TiniComponentConstructor,
  TiniComponentInstance,
  ConstructorArgs,
} from './types';
import {runGlobalHooks} from './methods';

export {
  property as Input,
  state as Reactive,
  query as Query,
  queryAll as QueryAll,
  queryAsync as QueryAsync,
} from 'lit/decorators.js';

const TiniComponentMixin = (superClass: TiniComponentConstructor) => {
  class TiniComponentChild extends superClass {
    private _dependenciesAvailable = !!this._pendingDI?.length;
    private get _dependenciesResolved() {
      return (this._pendingDI && this._pendingDI.length === 0) as boolean;
    }
    private _initialized?: boolean;

    constructor(...args: ConstructorArgs) {
      super(...args);
    }

    connectedCallback() {
      super.connectedCallback();
      // global hooks
      runGlobalHooks(LifecycleHooks.OnCreate, this);
      // component hook
      if (this.onCreate) this.onCreate();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      // global hooks
      runGlobalHooks(LifecycleHooks.OnDestroy, this);
      // component hook
      if (this.onDestroy) this.onDestroy();
    }

    willUpdate(changedProperties: any) {
      // global hooks
      runGlobalHooks(LifecycleHooks.OnChanges, this);
      // component hook
      if (this.onChanges) this.onChanges(changedProperties);
    }

    firstUpdated() {
      // process children rendering
      const root = this.shadowRoot as ShadowRoot;
      const children = root.querySelectorAll(
        '[await]'
      ) as unknown as TiniComponentInstance[];
      if (children.length) {
        const childUpdatedPromises = Array.from(children)
          .filter(item => !!item && !!item.childrenFirstUpdated)
          .map(item => {
            let resolveSchedule = () => {};
            const originalchildrenFirstUpdated = item.childrenFirstUpdated;
            item.childrenFirstUpdated = () => {
              originalchildrenFirstUpdated.bind(item)();
              resolveSchedule();
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new Promise(resolve => (resolveSchedule = resolve as any));
          });
        Promise.all(childUpdatedPromises).then(() =>
          this.childrenFirstUpdated()
        );
      } else {
        this.childrenFirstUpdated();
      }
      // global hooks
      runGlobalHooks(LifecycleHooks.OnReady, this);
      // component hook
      if (this.onReady) this.onReady();
    }

    updated() {
      // global hooks
      runGlobalHooks(LifecycleHooks.OnRenders, this);
      // component hook
      if (this.onRenders) this.onRenders();
    }

    childrenFirstUpdated() {
      // global hooks
      runGlobalHooks(LifecycleHooks.OnChildrenReady, this);
      // component hook
      if (this.onChildrenReady) this.onChildrenReady();
    }

    async scheduleUpdate() {
      const digest = async () => {
        this._pendingDI = []; // marked as resolved
        // component hook
        if (this.onInit) await this.onInit();
        // global hooks
        runGlobalHooks(LifecycleHooks.OnInit, this);
        // continue
        this._initialized = true; // mark as initialized
        super.scheduleUpdate();
      };
      // C: has dependencies but all are resolved
      if (this._initialized && this._dependenciesResolved) {
        super.scheduleUpdate();
      }
      // A: has no dependencies
      else if (!this._dependenciesAvailable) {
        await digest();
      }
      // B: has dependencies but none is resolved
      else {
        const dependencies = this._pendingDI || [];
        for (let i = 0; i < dependencies.length; i++) {
          await dependencies[i]();
        }
        await digest();
      }
    }
  }
  return TiniComponentChild as TiniComponentConstructor;
};

export const TiniComponent = TiniComponentMixin(
  LitElement as unknown as TiniComponentConstructor
) as TiniComponentConstructor;
