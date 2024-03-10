import {ActiveTheme, ThemingOptions} from './theme.js';

export function adoptScripts(
  host: HTMLElement,
  activeTheme: ActiveTheme,
  scripting: ThemingOptions<string>['scripting']
) {
  if (!scripting || !activeTheme) return;
  const {soulId, themeId} = activeTheme;
  const scripts =
    scripting[themeId] ||
    scripting[soulId] ||
    Object.values(scripting)[0] ||
    {};
  (host as any).___themeUnscript?.(host);
  (host as any).___themeUnscript = scripts.unscript;
  if (scripts.script) scripts.script(host);
}
