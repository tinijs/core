import {LitElement, html, css} from 'lit';
import {state, property, query, queryAll} from 'lit/decorators.js';

import {TiniComponentConstructor, ConstructorArgs} from './types';

export {html, css};
export {property as Input};
export {state as Reactive};
export {query as Query, queryAll as QueryAll};

const TiniComponentMixin = (superClass: TiniComponentConstructor) => {
  class TiniComponentChild extends superClass {
    private _dependenciesAvailable = !!this.$_pendingDependencies?.length;
    private get _dependenciesResolved() {
      return (this.$_pendingDependencies &&
        this.$_pendingDependencies.length === 0) as boolean;
    }
    private _initialized?: boolean;
    private _ready?: boolean;

    constructor(...args: ConstructorArgs) {
      super(...args);
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

    updated() {
      if (this.onRender) this.onRender();
      if (!this._ready) {
        this._ready = true;
        if (this.onReady) this.onReady();
      }
    }

    async scheduleUpdate() {
      // C: has dependencies but all are resolved
      if (this._initialized && this._dependenciesResolved) {
        super.scheduleUpdate();
      }
      // A: has no dependencies
      else if (!this._dependenciesAvailable) {
        this.$_pendingDependencies = []; // marked as resolved
        if (this.onInit) await this.onInit();
        this._initialized = true; // mark as initialized
        super.scheduleUpdate();
      }
      // B: has dependencies but none is resolved
      else {
        const dependencies = this.$_pendingDependencies || [];
        for (let i = 0; i < dependencies.length; i++) {
          await dependencies.splice(i, 1)[0]();
        }
        if (this.onInit) await this.onInit();
        this._initialized = true; // mark as initialized
        super.scheduleUpdate();
      }
    }
  }
  return TiniComponentChild as TiniComponentConstructor;
};

export const TiniComponent = TiniComponentMixin(
  LitElement as unknown as TiniComponentConstructor
) as TiniComponentConstructor;
