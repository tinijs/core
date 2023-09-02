import {ReactiveController, ReactiveControllerHost} from 'lit';

import {ObservableUnsubscribe} from './types';

export class Observer<Value> implements ReactiveController {
  private host!: ReactiveControllerHost;
  unsubscribes: ObservableUnsubscribe<Value>[] = [];

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  subscribe(...unsubscribes: ObservableUnsubscribe<Value>[]) {
    this.unsubscribes = unsubscribes;
  }

  hostDisconnected() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
  }
}
