import {getUI} from '../classes/ui-manager.js';
import {TiniElement} from '../classes/tini-element.js';

export type RegisterComponentsList = Array<
  CustomElementConstructor | [CustomElementConstructor, string]
>;

export enum UnstableStates {
  Experimental = 'experimental',
  Deprecated = 'deprecated',
}

export function ___checkForUnstableComponent(
  tagName: string,
  {
    componentName = 'unknown',
    componentMetadata: {unstable, unstableMessage},
  }: typeof TiniElement
) {
  if (unstable) {
    const messages = [
      `The component "${componentName}" (<${tagName}>) is ${unstable.toUpperCase()}.`,
    ];
    messages.push(
      {
        [UnstableStates.Experimental]:
          'Its API is not stable and may change in the future.',
        [UnstableStates.Deprecated]:
          'It is no longer recommended and will be removed in the future.',
      }[unstable]
    );
    if (unstableMessage) messages.push(unstableMessage);
    console.warn(messages.filter(Boolean).join(' '));
  }
}

export function ___checkForMissingBases(
  tagName: string,
  {componentMetadata: {warnAboutMissingBases}}: typeof TiniElement
) {
  if (!warnAboutMissingBases) return;
  const pickedBases = getUI().internalConfig?.basesMetadata?.pickedBases || [];
  const missingBases = warnAboutMissingBases.filter(
    item => !~pickedBases.indexOf(item)
  );
  console.warn(
    `The component "${tagName}" is missing the following bases: ${missingBases.join(
      ', '
    )}.`
  );
}

export function registerComponents(items: RegisterComponentsList) {
  return items.forEach(item => {
    const useCustomTagName = item instanceof Array;
    const [constructor, tagName] = useCustomTagName
      ? item
      : [item, (item as any).defaultTagName];
    if (!tagName || !constructor || customElements.get(tagName)) return;
    customElements.define(
      tagName,
      !useCustomTagName ? constructor : class extends constructor {}
    );
    if (process.env.NODE_ENV === 'development') {
      ___checkForUnstableComponent(tagName, constructor as typeof TiniElement);
      ___checkForMissingBases(tagName, constructor as typeof TiniElement);
    }
  });
}
