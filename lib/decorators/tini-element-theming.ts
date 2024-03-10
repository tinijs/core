import {TiniElement} from '../classes/tini-element';
import {ThemingOptions} from '../utils/theme';

export function TiniElementTheming<ThemeId extends string>(
  theming: ThemingOptions<ThemeId>
) {
  return function (target: typeof TiniElement) {
    return class extends target {
      static readonly theming = theming;
    } as any;
  };
}
