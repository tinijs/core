import {GLOBAL_TINI} from '../consts/global.js';

export type UIIconOptions = {
  resolve?(icon: string, provider?: string): string;
};

export type UIButtonOptions = {
  referGradientSchemeOnHover?: boolean;
};

export type UICodeOptions = {
  engine: string;
  highlight: (
    language: string,
    code: string,
    styleElement: HTMLStyleElement
  ) => string | Promise<string>;
  theme?: string;
};

export interface UIOptions<
  ExtendedOptions extends Record<string, unknown> = {},
> {
  [asteriskOrThemeIdOrSoulId: string]: {
    referGradientScheme?: boolean;
    // component specific options
    icon?: UIIconOptions;
    button?: UIButtonOptions;
    code?: UICodeOptions;
  } & ExtendedOptions;
}

export function setUIOptions<
  ExtendedOptions extends Record<string, unknown> = {},
>(options: UIOptions<ExtendedOptions>) {
  return (GLOBAL_TINI.uiOptions = (options ||
    {}) as UIOptions<ExtendedOptions>);
}

export function getUIOptions<
  ExtendedOptions extends Record<string, unknown> = {},
>() {
  return (GLOBAL_TINI.uiOptions || {}) as UIOptions<ExtendedOptions>;
}
