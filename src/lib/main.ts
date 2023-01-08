import {LitElement, CSSResult} from 'lit';
import {LIFECYCLE_HOOKS} from './consts';
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
} from 'lit/decorators';

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
      // component hook
      if (this.onCreate) this.onCreate();
      // global hooks
      runGlobalHooks(LIFECYCLE_HOOKS.ON_CREATE, this);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      // component hook
      if (this.onDestroy) this.onDestroy();
      // global hooks
      runGlobalHooks(LIFECYCLE_HOOKS.ON_DESTROY, this);
    }

    willUpdate() {
      // component hook
      if (this.onChanges) this.onChanges();
      // global hooks
      runGlobalHooks(LIFECYCLE_HOOKS.ON_CHANGES, this);
    }

    firstUpdated() {
      // component hook
      if (this.onReady) this.onReady();
      // global hooks
      runGlobalHooks(LIFECYCLE_HOOKS.ON_READY, this);
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
    }

    updated() {
      // component hook
      if (this.onRenders) this.onRenders();
      // global hooks
      runGlobalHooks(LIFECYCLE_HOOKS.ON_RENDERS, this);
    }

    childrenFirstUpdated() {
      // component hook
      if (this.onChildrenReady) this.onChildrenReady();
      // global hooks
      runGlobalHooks(LIFECYCLE_HOOKS.ON_CHILDREN_READY, this);
    }

    async scheduleUpdate() {
      const digest = async () => {
        this._pendingDI = []; // marked as resolved
        // component hook
        if (this.onInit) await this.onInit();
        // global hooks
        runGlobalHooks(LIFECYCLE_HOOKS.ON_INIT, this);
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

export function asset(path: string) {
  return path;
}

export const unistylus = (classNames?: TemplateStringsArray) => {
  return classNames as unknown as CSSResult;
};
