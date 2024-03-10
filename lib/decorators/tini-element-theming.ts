import {TiniElement} from '../classes/tini-element.js';
import {ThemingOptions} from '../utils/theme.js';

export function TiniElementTheming<ThemeId extends string>(
  theming: ThemingOptions<ThemeId>
) {
  return function (target: typeof TiniElement) {
    return class extends target {
      static readonly theming = theming;
    } as any;
  };
}
