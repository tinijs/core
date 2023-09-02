import {TiniComponentDerived, TiniComponentInstance} from './types';

export class EventEmitter<Payload> {
  private host: TiniComponentInstance;
  private eventName: string;

  constructor(host: TiniComponentInstance, eventName: string) {
    this.host = host;
    this.eventName = eventName;
  }

  emit(payload?: Payload, customEventInit: CustomEventInit<Payload> = {}) {
    return this.host.dispatchEvent(
      new CustomEvent(this.eventName, {
        detail: payload,
        ...customEventInit,
      })
    );
  }
}

export function Output() {
  return function (
    _: TiniComponentDerived,
    propertyKey: string,
    descriptor?: PropertyDescriptor
  ) {
    descriptor ||= {};
    descriptor.enumerable = false;
    descriptor.configurable = false;
    descriptor.get = function (this: TiniComponentInstance) {
      const emitterKey = `_${propertyKey}Emitter`;
      return (
        (this as any)[emitterKey] ||
        ((this as any)[emitterKey] = new EventEmitter<unknown>(
          this,
          propertyKey
        ))
      );
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return descriptor as any;
  };
}
