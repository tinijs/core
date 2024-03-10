import {CSSResultOrNative} from 'lit';

import {GLOBAL_TINI} from '../consts/global.js';
import {Breakpoints} from './varies.js';

export interface ActiveTheme {
  prevSoulId: string;
  prevSkinId: string;
  prevThemeId: string;
  soulId: string;
  skinId: string;
  themeId: string;
  breakpoints: Record<Lowercase<keyof typeof Breakpoints>, string>;
}

export interface ThemingOptions<ThemeId extends string> {
  styling?: Record<ThemeId, CSSResultOrNative[]>;
  scripting?: Record<ThemeId, ThemingScripting>;
}

export interface ThemingScripting {
  script?: (host: HTMLElement) => void;
  unscript?: ThemingScripting['script'];
}

export const THEME_CHANGE_EVENT = 'tini:theme-change';

export function getTheme(
  forced = false,
  prevData?: Pick<ActiveTheme, 'prevSoulId' | 'prevSkinId' | 'prevThemeId'>
) {
  if (!forced && GLOBAL_TINI.activeTheme) return GLOBAL_TINI.activeTheme;
  // themeId, soulId, skinId
  const themeId = document.body.dataset.theme;
  if (!themeId) throw new Error('No Tini UI theme found!');
  const [soulId, skinId] = themeId.split('/');
  // breakpoints
  const computedStyle = getComputedStyle(document.body);
  const breakpoints = Object.entries(Breakpoints).reduce(
    (result, [enumKey, defaultValue]) => {
      const key = enumKey.toLowerCase() as Lowercase<keyof typeof Breakpoints>;
      const value = computedStyle.getPropertyValue(`--wide-${key}`);
      result[key] = value || defaultValue;
      return result;
    },
    {} as Record<Lowercase<keyof typeof Breakpoints>, string>
  );
  // result
  return (GLOBAL_TINI.activeTheme = {
    prevSoulId: prevData?.prevSoulId || soulId,
    prevSkinId: prevData?.prevSkinId || skinId,
    prevThemeId: prevData?.prevThemeId || themeId,
    soulId,
    skinId,
    themeId,
    breakpoints,
  });
}

export function setTheme({soulId, skinId}: {soulId?: string; skinId?: string}) {
  const {soulId: currentSoulId, skinId: currentSkinId} = getTheme();
  soulId ||= currentSoulId;
  skinId ||= currentSkinId;
  if (!soulId || !skinId) throw new Error('Invalid soulId or skinId!');
  // 1. set <body data-theme="...">
  document.body.dataset.theme = `${soulId}/${skinId}`;
  // 2. dispatch a global event
  if (soulId !== currentSoulId || skinId !== currentSkinId) {
    dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, {
        detail: getTheme(true, {
          prevSoulId: currentSoulId,
          prevSkinId: currentSkinId,
          prevThemeId: `${currentSoulId}/${currentSkinId}`,
        }),
      })
    );
  }
}
