import {nothing, noChange} from 'lit';
import {
  AsyncDirective,
  PartInfo,
  ElementPart,
  directive,
} from 'lit/async-directive.js';
import {cache} from 'lit/directives/cache';
import {nanoid} from 'nanoid';

import {
  ActiveTheme,
  getTheme,
  processComponentStyles,
  THEME_CHANGE_EVENT,
} from 'tinijs';

import {RenderDataOrError, RenderTemplates} from './types';
import {RenderStatuses} from './consts';

export function render<Type>(
  dependencies: RenderDataOrError<unknown>[],
  templates: RenderTemplates<Type>
) {
  const main = templates.main;
  const loading = templates.loading || nothing;
  const empty = templates.empty || nothing;
  const error = templates.error || nothing;
  // check status
  const status = dependencies.every(item => item === undefined)
    ? RenderStatuses.Loading
    : dependencies.every(
        item =>
          item === null ||
          (item instanceof Array && !item.length) ||
          (item instanceof Map && !item.size) ||
          (item instanceof Object && !Object.keys(item).length)
      )
    ? RenderStatuses.Empty
    : dependencies.some(item => item instanceof Error)
    ? RenderStatuses.Error
    : RenderStatuses.Fulfilled;
  // render template accordingly
  return cache(
    status === RenderStatuses.Loading
      ? loading instanceof Function
        ? loading()
        : loading
      : status === RenderStatuses.Empty
      ? empty instanceof Function
        ? empty()
        : empty
      : status === RenderStatuses.Error
      ? error instanceof Function
        ? error(dependencies)
        : error
      : main instanceof Function
      ? main(dependencies)
      : main
  );
}

class StyleDeepDirective extends AsyncDirective {
  private readonly INTERNAL_ID = `_${nanoid(6)}`;

  private part!: ElementPart;
  private activeTheme = getTheme();
  private textOrStyling?: string | Record<string, string>;
  private removeThemeListener: (() => void) | undefined;

  private onThemeChange = (e: Event) => {
    const newTheme = (e as CustomEvent<ActiveTheme>).detail;
    if (this.activeTheme !== newTheme) {
      this.activeTheme = newTheme;
      this.injectStyle();
    }
  };

  constructor(part: PartInfo) {
    super(part);
    this.part = part as ElementPart;
  }

  disconnected() {
    this.removeThemeListener!();
  }

  reconnected() {
    this.addThemeListener();
  }

  render(textOrStyling: string | Record<string, string>) {
    if (this.checkForChanges(textOrStyling)) {
      this.removeThemeListener?.();
      this.textOrStyling = textOrStyling;
      if (this.isConnected) {
        this.addThemeListener();
      }
    }
    return noChange;
  }

  private addThemeListener() {
    addEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
    this.removeThemeListener = () =>
      removeEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
    return this.injectStyle();
  }

  private checkForChanges(textOrStyling: string | Record<string, string>) {
    const currentTextOrStyling = this.textOrStyling || '';
    if (typeof textOrStyling !== typeof currentTextOrStyling) {
      return true;
    } else if (typeof textOrStyling === 'string') {
      return textOrStyling !== currentTextOrStyling;
    } else {
      return Object.keys(textOrStyling).some(
        key =>
          textOrStyling[key] !==
          (currentTextOrStyling as Record<string, string>)[key]
      );
    }
  }

  private injectStyle() {
    const {host} = this.part?.options || {};
    const element = this.part?.element;
    if (!host || !element) return;
    const renderRoot =
      (((host as HTMLElement).shadowRoot || host) as ShadowRoot) || HTMLElement;
    const {soulId, themeId} = this.activeTheme;
    const rawStyleText = !this.textOrStyling
      ? ''
      : typeof this.textOrStyling === 'string'
      ? this.textOrStyling
      : this.textOrStyling[themeId] ||
        this.textOrStyling[soulId] ||
        Object.values(this.textOrStyling)[0];
    const styleText = processComponentStyles(
      [rawStyleText],
      this.activeTheme,
      content => content.replace(/\.root/g, `.${this.INTERNAL_ID}`)
    );
    // apply styles
    const currentStyleElement = renderRoot.getElementById(this.INTERNAL_ID);
    const styleElement = currentStyleElement || document.createElement('style');
    styleElement.textContent = styleText;
    if (!currentStyleElement)
      setTimeout(() => {
        element.classList.add(this.INTERNAL_ID);
        styleElement.id = this.INTERNAL_ID;
        renderRoot.appendChild(styleElement);
      }, 0);
  }
}

export const styleDeep = directive(StyleDeepDirective);
