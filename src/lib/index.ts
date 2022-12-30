import {LitElement, html, css} from 'lit';
import {state, property} from 'lit/decorators.js';

export {html, css};
export {state as State};
export {property as Property};

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class TiniComponentMixinInterface {
  onCreate(): void | Promise<void>;
  onInit(): void | Promise<void>;
  onDestroy(): void | Promise<void>;
}

const TiniComponentMixin = <
  T extends Constructor<LitElement>,
  C extends Constructor<TiniComponentMixinInterface> & T
>(
  superClass: C
) => {
  class MixinClass extends superClass {
    constructor(...args: any[]) {
      super(...args);
    }

    connectedCallback(): void {
      super.connectedCallback();
      if (this.onCreate) this.onCreate();
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      if (this.onDestroy) this.onDestroy();
    }

    async scheduleUpdate(): Promise<void> {
      const resolvers = (this as any).$resolveDependencies || [];
      for (let i = 0; i < resolvers.length; i++) {
        await resolvers[i]();
      }
      if (this.onDestroy) await this.onDestroy();
      if (this.onInit) await this.onInit();
      super.scheduleUpdate();
    }
  }
  return MixinClass as C;
};

export const TiniComponent = TiniComponentMixin(
  LitElement as any
) as Constructor<LitElement> & Constructor<TiniComponentMixinInterface>;
