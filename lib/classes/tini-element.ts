import {
  LitElement,
  PropertyValues,
  CSSResultOrNative,
  TemplateResult,
  unsafeCSS,
  getCompatibleStyle,
  adoptStyles,
} from 'lit';
import {property} from 'lit/decorators/property.js';
import {ClassInfo} from 'lit/directives/class-map.js';
import {defu} from 'defu';

import {
  THEME_CHANGE_EVENT,
  UIOptions,
  UIButtonOptions,
  Theming,
  getUI,
  getStylesFromTheming,
  getScriptsFromTheming,
  processComponentStyles,
} from '../classes/ui-manager.js';
import {
  COMMON_COLORS_TO_COMMON_GRADIENTS,
  VaryGroups,
} from '../utils/varies.js';
import {
  UnstableStates,
  RegisterComponentsList,
  registerComponents,
} from '../utils/components.js';
import {EventForwarding, forwardEvents} from '../utils/events.js';

export interface ExtendRootClassesInput {
  raw?: ClassInfo;
  pseudo?: Record<string, Record<string, undefined | string>>;
  overridable?: Record<string, undefined | string>;
}

export interface ComponentMetadata {
  colorOnlyScheme?: boolean;
  mainNonRootSelector?: string;
  // dev only
  unstable?: UnstableStates;
  unstableMessage?: string;
  warnAboutMissingBases?: string[];
}

export class TiniElement extends LitElement {
  static readonly componentName: string = 'unnamed';
  static readonly defaultTagName: string = 'tini-element';
  static readonly componentMetadata: ComponentMetadata = {};

  static readonly theming?: Theming;
  static readonly components?: RegisterComponentsList;

  private ui = getUI();
  private uiTracker = {
    extraStylesAdopted: false,
    pendingScriptsAdoption: this.getScripts(),
  };

  protected rootClasses: ClassInfo = {root: true};
  protected additionalParts: Record<string, TemplateResult> = {};

  /* eslint-disable prettier/prettier */
  @property({type: String, reflect: true}) declare styleDeep?: string;
  @property({type: Object}) declare refers?: Record<string, Record<string, any>>;
  @property() declare events?: string | Array<string | EventForwarding>;
  /* eslint-enable prettier/prettier */

  protected createRenderRoot() {
    const renderRoot =
      this.shadowRoot ??
      this.attachShadow(
        (this.constructor as typeof LitElement).shadowRootOptions
      );
    this.customAdoptStyles(renderRoot);
    return renderRoot;
  }

  private onThemeChange = () => {
    this.uiTracker.pendingScriptsAdoption = this.getScripts();
    return this.requestUpdate();
  };

  connectedCallback() {
    this.registerComponents();
    super.connectedCallback();
    addEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
  }

  protected willUpdate(changedProperties: PropertyValues<this>) {
    // re-style when deepStyle changed
    if (changedProperties.has('styleDeep')) {
      if (!this.uiTracker.extraStylesAdopted) {
        this.uiTracker.extraStylesAdopted = true; // skip the first time, already adopted in createRenderRoot()
      } else {
        this.customAdoptStyles(this.shadowRoot || this);
      }
    }
    // adopt scripts
    const {prevScripts, currentScripts} = this.uiTracker.pendingScriptsAdoption;
    prevScripts?.unscriptWillUpdate?.(this);
    currentScripts?.willUpdate?.(this);
  }

  protected firstUpdated(changedProperties: PropertyValues<this>) {
    if (this.events) forwardEvents(this, this.events);
  }

  protected updated(changedProperties: PropertyValues<this>) {
    // adopt scripts
    const {prevScripts, currentScripts} = this.uiTracker.pendingScriptsAdoption;
    prevScripts?.unscriptUpdated?.(this);
    currentScripts?.updated?.(this);
  }

  protected getUIOptions<
    ComponentSpecificOptions extends Record<string, unknown> = {},
    ExtendedOptions extends Record<string, unknown> = {},
  >() {
    const themeOptions = defu(
      this.ui.options?.[this.ui.activeTheme.themeId],
      this.ui.options?.[this.ui.activeTheme.familyId],
      this.ui.options?.['*'],
      {}
    ) as UIOptions<ExtendedOptions>;
    const componentOptions = ((themeOptions as any)?.[
      (this.constructor as typeof TiniElement).componentName
    ] || {}) as ComponentSpecificOptions;
    return {themeOptions, componentOptions};
  }

  extendRootClasses(input: ExtendRootClassesInput) {
    const {raw = {}, pseudo = {}, overridable = {}} = input;
    const {componentOptions} = this.getUIOptions<UIButtonOptions>();
    // build pseudo info
    const pseudoInfo = Object.entries(pseudo).reduce(
      (result, [key, value]) => {
        return !value
          ? result
          : {
              ...result,
              ...Object.entries(value).reduce(
                (r, [k, v]) => {
                  if (!v) return r;
                  r[`${k}-${v}-${key}`] = true;
                  return r;
                },
                {} as Record<string, boolean>
              ),
            };
      },
      {} as Record<string, boolean>
    );
    // build overridable info
    const overridableFinalValues = {} as Record<string, string>;
    const overridableInfo = Object.entries(overridable).reduce(
      (result, [key, originalValue]) => {
        if (!originalValue) return result;
        const value = this.calculatePropertyValue(key, originalValue);
        overridableFinalValues[key] = value;
        result[`${key}-${value}`] = true;
        return result;
      },
      {} as Record<string, boolean>
    );
    // other info:
    // + refer gradient scheme on hover
    const otherInfo = {} as Record<string, boolean>;
    const schemeValue = overridableFinalValues[VaryGroups.Scheme];
    if (
      componentOptions.referGradientSchemeOnHover &&
      schemeValue &&
      !~schemeValue.indexOf('gradient')
    ) {
      const hoverScheme =
        (COMMON_COLORS_TO_COMMON_GRADIENTS as Record<string, string>)[
          schemeValue
        ] || `gradient-${schemeValue}`;
      otherInfo[`${VaryGroups.Scheme}-${hoverScheme}-hover`] = true;
    }
    // result
    return (this.rootClasses = {
      ...this.rootClasses,
      ...raw,
      ...pseudoInfo,
      ...overridableInfo,
      ...otherInfo,
    });
  }

  private registerComponents() {
    const components = (this.constructor as typeof TiniElement).components;
    if (components) registerComponents(components);
  }

  private calculatePropertyValue(name: string, originalValue: string) {
    const {themeOptions} = this.getUIOptions();
    // no theme
    if (!this.ui.activeTheme) return originalValue;
    // refers
    const camelName = name.replace(/-(\w)/g, (_, letter) =>
      letter.toUpperCase()
    );
    const referValue =
      this.refers?.[this.ui.activeTheme.themeId]?.[camelName] ||
      this.refers?.[this.ui.activeTheme.themeId]?.[name] ||
      this.refers?.[this.ui.activeTheme.familyId]?.[camelName] ||
      this.refers?.[this.ui.activeTheme.familyId]?.[name];
    if (referValue) return referValue;
    // refer gradient scheme
    if (
      !(this.constructor as typeof TiniElement).componentMetadata
        ?.colorOnlyScheme &&
      name === VaryGroups.Scheme &&
      themeOptions.referGradientScheme
    ) {
      return ~originalValue.indexOf('gradient')
        ? originalValue
        : (COMMON_COLORS_TO_COMMON_GRADIENTS as Record<string, string>)[
            originalValue
          ] || `gradient-${originalValue}`;
    }
    // default value
    return originalValue;
  }

  private customAdoptStyles(renderRoot: HTMLElement | DocumentFragment) {
    const allStyles = [] as Array<string | CSSResultOrNative>;
    // theme styles
    allStyles.push(
      ...getStylesFromTheming(
        (this.constructor as typeof TiniElement).theming,
        this.ui.activeTheme
      )
    );
    // element styles
    allStyles.push(...(this.constructor as typeof LitElement).elementStyles);
    // from styleDeep
    if (this.styleDeep) allStyles.push(this.styleDeep);
    // adopt all the styles
    const styleText = processComponentStyles(allStyles, this.ui.activeTheme);
    adoptStyles(renderRoot as unknown as ShadowRoot, [
      getCompatibleStyle(unsafeCSS(styleText)),
    ]);
  }

  private getScripts() {
    return getScriptsFromTheming(
      this,
      (this.constructor as typeof TiniElement).theming,
      this.ui.activeTheme
    );
  }
}
