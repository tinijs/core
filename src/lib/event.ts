import {TiniComponentChild, TiniComponentInstance} from './types';

export class EventEmitter<Payload> {
  private _host: TiniComponentInstance;
  private _eventName: string;

  constructor(host: TiniComponentInstance, eventName: string) {
    this._host = host;
    this._eventName = eventName;
  }

  emit(payload?: Payload, customEventInit: CustomEventInit<Payload> = {}) {
    return this._host.dispatchEvent(
      new CustomEvent(this._eventName, {
        detail: payload,
        bubbles: true,
        composed: true,
        cancelable: true,
        ...customEventInit,
      })
    );
  }
}

export function Output() {
  return function (
    target: TiniComponentChild,
    propertyKey: string,
    descriptor?: PropertyDescriptor
  ) {
    descriptor = descriptor || {};
    descriptor.enumerable = false;
    descriptor.configurable = false;
    descriptor.get = function (this: TiniComponentInstance) {
      return new EventEmitter<unknown>(this, propertyKey);
    };
    return descriptor as any;
  };
}
