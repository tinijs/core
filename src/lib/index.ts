import {LitElement, html, css} from 'lit';
import {state, property} from 'lit/decorators.js';

import {TiniComponentConstructor, ConstructorArgs} from './types';

export {html, css};
export {state as State};
export {property as Property};

const TiniComponentMixin = (superClass: TiniComponentConstructor) => {
  class MixinClass extends superClass {
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

    async scheduleUpdate() {
      const resolvers = this.$_resolveDependencies;
      if (resolvers?.length) {
        for (let i = 0; i < resolvers.length; i++) await resolvers[i]();
      }
      if (this.onDestroy) await this.onDestroy();
      if (this.onInit) await this.onInit();
      super.scheduleUpdate();
    }
  }
  return MixinClass as TiniComponentConstructor;
};

export const TiniComponent = TiniComponentMixin(
  LitElement as unknown as TiniComponentConstructor
) as TiniComponentConstructor;
