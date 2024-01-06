import {ReactiveController, ReactiveControllerHost} from 'lit';

import {ObservableCallback, ObservableUnobserve} from './types';

export class Observing implements ReactiveController {
  unobserves: ObservableUnobserve[] = [];

  constructor(host: ReactiveControllerHost) {
    host.addController(this);
  }

  observe(...unobserves: ObservableUnobserve[]) {
    if (unobserves.length) unobserves.push(...this.unobserves);
    return this;
  }

  hostDisconnected() {
    this.unobserves.forEach(unsubscribe => unsubscribe());
    this.unobserves = [];
  }
}

export function Observable(handlerName?: string, skipInitial?: boolean) {
  return function (prototype: any, propertyName: string) {
    const valueKey = `___${propertyName}`;
    const handlerKey = handlerName || `${propertyName}Changed`;
    const callbacks: Map<symbol, ObservableCallback<unknown>> = new Map();
    Object.defineProperty(prototype, valueKey, {
      value: undefined,
      writable: true,
    });
    Object.defineProperty(prototype, handlerKey, {
      value: (callback: ObservableCallback<unknown>) => {
        // initial
        const currentVal = prototype[valueKey];
        if (!skipInitial && currentVal !== undefined) {
          callback(currentVal, undefined);
        }
        // add callback & return unobserve
        const subscriptionId = Symbol();
        callbacks.set(subscriptionId, callback);
        return () => callbacks.delete(subscriptionId);
      },
    });
    Object.defineProperty(prototype, propertyName, {
      get: () => prototype[valueKey],
      set: newValue => {
        let oldValue = prototype[valueKey];
        oldValue =
          !oldValue || typeof oldValue !== 'object'
            ? oldValue
            : JSON.parse(JSON.stringify(oldValue));
        prototype[valueKey] = newValue;
        callbacks.forEach(handler => handler?.(newValue, oldValue));
      },
    });
  };
}

export function Observe() {
  return function (prototype: any, propertyName: string) {
    const observerKey = Symbol();
    Object.defineProperty(prototype, propertyName, {
      get: function () {
        const observing = (this[observerKey] ||= new Observing(
          this
        )) as Observing;
        return observing.observe.bind(observing);
      },
    });
  };
}
