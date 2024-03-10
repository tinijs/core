import {TiniElement} from '../classes/tini-element.js';
import {
  RegisterComponentsList,
  registerComponents,
} from '../utils/components.js';

export function TiniElementComponents(items: RegisterComponentsList) {
  return function (target: typeof TiniElement) {
    return class extends target {
      connectedCallback() {
        registerComponents(items);
        super.connectedCallback();
      }
    } as any;
  };
}
