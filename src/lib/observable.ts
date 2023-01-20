import {ReactiveController, ReactiveControllerHost} from 'lit';
import {ObservableUnsubscribe} from './types';

export class ObservableSubscription<Value> implements ReactiveController {
  private _host!: ReactiveControllerHost;
  unsubscribes: ObservableUnsubscribe<Value>[] = [];

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  subscribe(...unsubscribes: ObservableUnsubscribe<Value>[]) {
    this.unsubscribes = unsubscribes;
  }

  hostDisconnected() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
  }
}
