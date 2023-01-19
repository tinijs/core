import {ReactiveController, ReactiveControllerHost} from 'lit';

import {ObservableUnsubscribe} from './types';

export class ObservableSubscription<Value> implements ReactiveController {
  private _host!: ReactiveControllerHost;
  unsubscribe?: ObservableUnsubscribe<Value>;

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  subscribe(unsubscribe: ObservableUnsubscribe<Value>) {
    if (!this.unsubscribe) {
      this.unsubscribe = unsubscribe;
    }
  }

  hostDisconnected() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}
