import {TiniComponentChild, TiniComponentInstance} from './types';

export class EventEmitter<Payload> {
  private _host: TiniComponentInstance;
  private _eventName: string;

  constructor(host: TiniComponentInstance, eventName: string) {
    this._host = host;
    this._eventName = eventName;
  }

  emit(payload?: Payload) {
    return this._host.dispatchEvent(
      new CustomEvent(this._eventName, {
        detail: payload,
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
  }
}

export function Output() {
  return function (
    target: TiniComponentChild,
    propertyKey: string,
    descriptor?: any
  ) {
    descriptor = descriptor || {};
    descriptor.get = function (this: TiniComponentInstance) {
      return new EventEmitter<unknown>(this, propertyKey);
    };
    return descriptor;
  };
}
