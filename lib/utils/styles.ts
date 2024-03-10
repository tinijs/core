import {CSSResultOrNative} from 'lit';

import {ActiveTheme} from './theme.js';

export function processComponentStyles(
  allStyles: Array<string | CSSResultOrNative>,
  activeTheme: ActiveTheme,
  additionalProcess?: (styleText: string, activeTheme: ActiveTheme) => string
) {
  // 1. combine all styles
  let styleText = allStyles
    .map(style => {
      if (typeof style === 'string') {
        return style;
      } else if (style instanceof CSSStyleSheet) {
        let text = '';
        for (const rule of style.cssRules as any) {
          text += '\n' + rule.cssText;
        }
        return text;
      } else {
        return style.cssText;
      }
    })
    .join('\n');
  // 2. run additional process
  if (additionalProcess) styleText = additionalProcess(styleText, activeTheme);
  // 3. replace breakpoints
  Object.entries(activeTheme.breakpoints).forEach(
    ([key, value]) =>
      (styleText = styleText.replace(
        new RegExp(`: ?(${key}|${key.toUpperCase()})\\)`, 'g'),
        `: ${value})`
      ))
  );
  // result
  return styleText;
}
