import {LitElement, html, css} from 'lit';
import {state, property, query, queryAll} from 'lit/decorators.js';
import {COMPONENT_TYPES, GLOBAL} from './consts';
import {
  TiniComponentConstructor,
  TiniComponentInstance,
  ConstructorArgs,
  AppOptions,
} from './types';
import {hideAppSplashscreen} from './methods';

export {html, css};
export {property as Input};
export {state as Reactive};
export {query as Query, queryAll as QueryAll};

const TiniComponentMixin = (superClass: TiniComponentConstructor) => {
  class TiniComponentChild extends superClass {
    private _appOptions?: AppOptions;
    private _dependenciesAvailable = !!this._pendingDI?.length;
    private get _dependenciesResolved() {
      return (this._pendingDI && this._pendingDI.length === 0) as boolean;
    }
    private _initialized?: boolean;

    constructor(...args: ConstructorArgs) {
      super(...args);
      this._appOptions = GLOBAL.$tiniAppOptions;
    }

    connectedCallback() {
      super.connectedCallback();
      if (this.onCreate) this.onCreate();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this.onDestroy) this.onDestroy();
    }

    willUpdate() {
      if (this.onChanges) this.onChanges();
    }

    firstUpdated() {
      if (this.onReady) this.onReady();
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
      if (this.onRenders) this.onRenders();
    }

    childrenFirstUpdated() {
      if (this.onChildrenReady) this.onChildrenReady();
      // handle app splashscreen
      if (
        this.componentType === COMPONENT_TYPES.PAGE &&
        this._appOptions?.splashscreen === 'auto'
      ) {
        hideAppSplashscreen();
      }
    }

    async scheduleUpdate() {
      const digest = async () => {
        this._pendingDI = []; // marked as resolved
        if (this.onInit) await this.onInit();
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
