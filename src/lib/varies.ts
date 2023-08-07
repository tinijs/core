import {unsafeCSS} from 'lit';

type SizeVaryHandler = (size: Sizes) => string;
type SizeFactorVaryHandler = (sizeFactor: SizeFactors) => string;
type FontTypeVaryHandler = (fontType: FontTypes) => string;
type ColorOrGradientVaryHandler<Values> = (values: Values) => string;
type ColorOrGradientValuesBuilder = (
  id: string,
  vary: string
) => Record<string, any>;
interface ColorValues {
  id: string;
  vary: string;
  suffix: string;
  name: string;
  color: string;
  contrast: string;
}
interface GradientValues extends ColorValues {
  gradient: string;
  gradientContrast: string;
}

export type SizeFactors = SizeBasicFactors | SizeExtraFactors;
export type FontSizeFactors = SizeFactors;
export type SpaceSizeFactors = SizeFactors;
export type ColorsAndGradients = Colors | Gradients;

export enum Sizes {
  XXXS = 'xxxs',
  XXS = 'xxs',
  XS = 'xs',
  SS = 'ss',
  SM = 'sm',
  MD = 'md',
  ML = 'ml',
  LG = 'lg',
  SL = 'sl',
  XL = 'xl',
  XXL = 'xxl',
  XXXL = 'xxxl',
}
export enum SizeBasicFactors {
  X0_1 = '0_1x',
  X0_2 = '0_2x',
  X0_25 = '0_25x',
  X0_3 = '0_3x',
  X0_4 = '0_4x',
  X0_5 = '0_5x',
  X0_6 = '0_6x',
  X0_7 = '0_7x',
  X0_75 = '0_75x',
  X0_8 = '0_8x',
  X0_9 = '0_9x',
  X1_25 = '1_25x',
  X1_5 = '1_5x',
  X1_75 = '1_75x',
  X2 = '2x',
  X3 = '3x',
  X4 = '4x',
  X5 = '5x',
}
export enum SizeExtraFactors {
  X6 = '6x',
  X7 = '7x',
  X8 = '8x',
  X9 = '9x',
  X10 = '10x',
}
export enum ColorVaries {
  Contrast = 'contrast',
  Shade = 'shade',
  Tint = 'tint',
}
export enum ColorExtraVaries {
  Shade2 = 'shade-2',
  Shade3 = 'shade-3',
  Shade4 = 'shade-4',
  Shade5 = 'shade-5',
  Tint2 = 'tint-2',
  Tint3 = 'tint-3',
  Tint4 = 'tint-4',
  Tint5 = 'tint-5',
}
export enum Colors {
  Primary = 'primary',
  PrimaryContrast = 'primary-contrast',
  PrimaryShade = 'primary-shade',
  PrimaryShade2 = 'primary-shade-2',
  PrimaryShade3 = 'primary-shade-3',
  PrimaryShade4 = 'primary-shade-4',
  PrimaryShade5 = 'primary-shade-5',
  PrimaryTint = 'primary-tint',
  PrimaryTint2 = 'primary-tint-2',
  PrimaryTint3 = 'primary-tint-3',
  PrimaryTint4 = 'primary-tint-4',
  PrimaryTint5 = 'primary-tint-5',
  Secondary = 'secondary',
  SecondaryContrast = 'secondary-contrast',
  SecondaryShade = 'secondary-shade',
  SecondaryShade2 = 'secondary-shade-2',
  SecondaryShade3 = 'secondary-shade-3',
  SecondaryShade4 = 'secondary-shade-4',
  SecondaryShade5 = 'secondary-shade-5',
  SecondaryTint = 'secondary-tint',
  SecondaryTint2 = 'secondary-tint-2',
  SecondaryTint3 = 'secondary-tint-3',
  SecondaryTint4 = 'secondary-tint-4',
  SecondaryTint5 = 'secondary-tint-5',
  Tertiary = 'tertiary',
  TertiaryContrast = 'tertiary-contrast',
  TertiaryShade = 'tertiary-shade',
  TertiaryShade2 = 'tertiary-shade-2',
  TertiaryShade3 = 'tertiary-shade-3',
  TertiaryShade4 = 'tertiary-shade-4',
  TertiaryShade5 = 'tertiary-shade-5',
  TertiaryTint = 'tertiary-tint',
  TertiaryTint2 = 'tertiary-tint-2',
  TertiaryTint3 = 'tertiary-tint-3',
  TertiaryTint4 = 'tertiary-tint-4',
  TertiaryTint5 = 'tertiary-tint-5',
  Success = 'success',
  SuccessContrast = 'success-contrast',
  SuccessShade = 'success-shade',
  SuccessShade2 = 'success-shade-2',
  SuccessShade3 = 'success-shade-3',
  SuccessShade4 = 'success-shade-4',
  SuccessShade5 = 'success-shade-5',
  SuccessTint = 'success-tint',
  SuccessTint2 = 'success-tint-2',
  SuccessTint3 = 'success-tint-3',
  SuccessTint4 = 'success-tint-4',
  SuccessTint5 = 'success-tint-5',
  Danger = 'danger',
  DangerContrast = 'danger-contrast',
  DangerShade = 'danger-shade',
  DangerShade2 = 'danger-shade-2',
  DangerShade3 = 'danger-shade-3',
  DangerShade4 = 'danger-shade-4',
  DangerShade5 = 'danger-shade-5',
  DangerTint = 'danger-tint',
  DangerTint2 = 'danger-tint-2',
  DangerTint3 = 'danger-tint-3',
  DangerTint4 = 'danger-tint-4',
  DangerTint5 = 'danger-tint-5',
  Warning = 'warning',
  WarningContrast = 'warning-contrast',
  WarningShade = 'warning-shade',
  WarningShade2 = 'warning-shade-2',
  WarningShade3 = 'warning-shade-3',
  WarningShade4 = 'warning-shade-4',
  WarningShade5 = 'warning-shade-5',
  WarningTint = 'warning-tint',
  WarningTint2 = 'warning-tint-2',
  WarningTint3 = 'warning-tint-3',
  WarningTint4 = 'warning-tint-4',
  WarningTint5 = 'warning-tint-5',
  Dark = 'dark',
  DarkContrast = 'dark-contrast',
  DarkShade = 'dark-shade',
  DarkShade2 = 'dark-shade-2',
  DarkShade3 = 'dark-shade-3',
  DarkShade4 = 'dark-shade-4',
  DarkShade5 = 'dark-shade-5',
  DarkTint = 'dark-tint',
  DarkTint2 = 'dark-tint-2',
  DarkTint3 = 'dark-tint-3',
  DarkTint4 = 'dark-tint-4',
  DarkTint5 = 'dark-tint-5',
  Medium = 'medium',
  MediumContrast = 'medium-contrast',
  MediumShade = 'medium-shade',
  MediumShade2 = 'medium-shade-2',
  MediumShade3 = 'medium-shade-3',
  MediumShade4 = 'medium-shade-4',
  MediumShade5 = 'medium-shade-5',
  MediumTint = 'medium-tint',
  MediumTint2 = 'medium-tint-2',
  MediumTint3 = 'medium-tint-3',
  MediumTint4 = 'medium-tint-4',
  MediumTint5 = 'medium-tint-5',
  Light = 'light',
  LightContrast = 'light-contrast',
  LightShade = 'light-shade',
  LightShade2 = 'light-shade-2',
  LightShade3 = 'light-shade-3',
  LightShade4 = 'light-shade-4',
  LightShade5 = 'light-shade-5',
  LightTint = 'light-tint',
  LightTint2 = 'light-tint-2',
  LightTint3 = 'light-tint-3',
  LightTint4 = 'light-tint-4',
  LightTint5 = 'light-tint-5',
  Background = 'background',
  BackgroundContrast = 'background-contrast',
  BackgroundShade = 'background-shade',
  BackgroundShade2 = 'background-shade-2',
  BackgroundShade3 = 'background-shade-3',
  BackgroundShade4 = 'background-shade-4',
  BackgroundShade5 = 'background-shade-5',
  BackgroundTint = 'background-tint',
  BackgroundTint2 = 'background-tint-2',
  BackgroundTint3 = 'background-tint-3',
  BackgroundTint4 = 'background-tint-4',
  BackgroundTint5 = 'background-tint-5',
  Middleground = 'middleground',
  MiddlegroundContrast = 'middleground-contrast',
  MiddlegroundShade = 'middleground-shade',
  MiddlegroundShade2 = 'middleground-shade-2',
  MiddlegroundShade3 = 'middleground-shade-3',
  MiddlegroundShade4 = 'middleground-shade-4',
  MiddlegroundShade5 = 'middleground-shade-5',
  MiddlegroundTint = 'middleground-tint',
  MiddlegroundTint2 = 'middleground-tint-2',
  MiddlegroundTint3 = 'middleground-tint-3',
  MiddlegroundTint4 = 'middleground-tint-4',
  MiddlegroundTint5 = 'middleground-tint-5',
  Foreground = 'foreground',
  ForegroundContrast = 'foreground-contrast',
  ForegroundShade = 'foreground-shade',
  ForegroundShade2 = 'foreground-shade-2',
  ForegroundShade3 = 'foreground-shade-3',
  ForegroundShade4 = 'foreground-shade-4',
  ForegroundShade5 = 'foreground-shade-5',
  ForegroundTint = 'foreground-tint',
  ForegroundTint2 = 'foreground-tint-2',
  ForegroundTint3 = 'foreground-tint-3',
  ForegroundTint4 = 'foreground-tint-4',
  ForegroundTint5 = 'foreground-tint-5',
}
export enum Gradients {
  GradientPrimary = 'gradient-primary',
  GradientPrimaryContrast = 'gradient-primary-contrast',
  GradientPrimaryShade = 'gradient-primary-shade',
  GradientPrimaryTint = 'gradient-primary-tint',
  GradientSecondary = 'gradient-secondary',
  GradientSecondaryContrast = 'gradient-secondary-contrast',
  GradientSecondaryShade = 'gradient-secondary-shade',
  GradientSecondaryTint = 'gradient-secondary-tint',
  GradientTertiary = 'gradient-tertiary',
  GradientTertiaryContrast = 'gradient-tertiary-contrast',
  GradientTertiaryShade = 'gradient-tertiary-shade',
  GradientTertiaryTint = 'gradient-tertiary-tint',
  GradientSuccess = 'gradient-success',
  GradientSuccessContrast = 'gradient-success-contrast',
  GradientSuccessShade = 'gradient-success-shade',
  GradientSuccessTint = 'gradient-success-tint',
  GradientDanger = 'gradient-danger',
  GradientDangerContrast = 'gradient-danger-contrast',
  GradientDangerShade = 'gradient-danger-shade',
  GradientDangerTint = 'gradient-danger-tint',
  GradientWarning = 'gradient-warning',
  GradientWarningContrast = 'gradient-warning-contrast',
  GradientWarningShade = 'gradient-warning-shade',
  GradientWarningTint = 'gradient-warning-tint',
  GradientDark = 'gradient-dark',
  GradientDarkContrast = 'gradient-dark-contrast',
  GradientDarkShade = 'gradient-dark-shade',
  GradientDarkTint = 'gradient-dark-tint',
  GradientMedium = 'gradient-medium',
  GradientMediumContrast = 'gradient-medium-contrast',
  GradientMediumShade = 'gradient-medium-shade',
  GradientMediumTint = 'gradient-medium-tint',
  GradientLight = 'gradient-light',
  GradientLightContrast = 'gradient-light-contrast',
  GradientLightShade = 'gradient-light-shade',
  GradientLightTint = 'gradient-light-tint',
  GradientBackground = 'gradient-background',
  GradientBackgroundContrast = 'gradient-background-contrast',
  GradientBackgroundShade = 'gradient-background-shade',
  GradientBackgroundTint = 'gradient-background-tint',
  GradientMiddleground = 'gradient-middleground',
  GradientMiddlegroundContrast = 'gradient-middleground-contrast',
  GradientMiddlegroundShade = 'gradient-middleground-shade',
  GradientMiddlegroundTint = 'gradient-middleground-tint',
  GradientForeground = 'gradient-foreground',
  GradientForegroundContrast = 'gradient-foreground-contrast',
  GradientForegroundShade = 'gradient-foreground-shade',
  GradientForegroundTint = 'gradient-foreground-tint',
}
export enum FontTypes {
  Head = 'head',
  Body = 'body',
  Quote = 'quote',
  Code = 'code',
}

const SIZES = [
  Sizes.XXXS,
  Sizes.XXS,
  Sizes.XS,
  Sizes.SS,
  Sizes.SM,
  Sizes.MD,
  Sizes.ML,
  Sizes.LG,
  Sizes.SL,
  Sizes.XL,
  Sizes.XXL,
  Sizes.XXXL,
];
const COLORS = [
  Colors.Primary,
  Colors.Secondary,
  Colors.Tertiary,
  Colors.Success,
  Colors.Danger,
  Colors.Warning,
  Colors.Dark,
  Colors.Medium,
  Colors.Light,
  Colors.Background,
  Colors.Middleground,
  Colors.Foreground,
];
const COLOR_VARIES = [
  ColorVaries.Contrast,
  ColorVaries.Shade,
  ColorVaries.Tint,
];
const COLOR_EXTRA_VARIES = [
  ColorExtraVaries.Shade2,
  ColorExtraVaries.Shade3,
  ColorExtraVaries.Shade4,
  ColorExtraVaries.Shade5,
  ColorExtraVaries.Tint2,
  ColorExtraVaries.Tint3,
  ColorExtraVaries.Tint4,
  ColorExtraVaries.Tint5,
];
const BASIC_FACTORS = [
  SizeBasicFactors.X0_1,
  SizeBasicFactors.X0_2,
  SizeBasicFactors.X0_25,
  SizeBasicFactors.X0_3,
  SizeBasicFactors.X0_4,
  SizeBasicFactors.X0_5,
  SizeBasicFactors.X0_6,
  SizeBasicFactors.X0_7,
  SizeBasicFactors.X0_75,
  SizeBasicFactors.X0_8,
  SizeBasicFactors.X0_9,
  SizeBasicFactors.X1_25,
  SizeBasicFactors.X1_5,
  SizeBasicFactors.X1_75,
  SizeBasicFactors.X2,
  SizeBasicFactors.X3,
  SizeBasicFactors.X4,
  SizeBasicFactors.X5,
];
const EXTRA_FACTORS = [
  SizeExtraFactors.X6,
  SizeExtraFactors.X7,
  SizeExtraFactors.X8,
  SizeExtraFactors.X9,
  SizeExtraFactors.X10,
];
const FONT_TYPES = [
  FontTypes.Head,
  FontTypes.Body,
  FontTypes.Quote,
  FontTypes.Code,
];

function colorOrGradientVaries(
  colors: string[],
  varies: string[],
  handler: ColorOrGradientVaryHandler<any>,
  valueBuilder: ColorOrGradientValuesBuilder
) {
  return unsafeCSS(
    colors
      .map(id => varies.map(vary => handler(valueBuilder(id, vary))).join(''))
      .join('')
  );
}
export function generateColorVaries(
  handler: ColorOrGradientVaryHandler<ColorValues>
) {
  return colorOrGradientVaries(
    COLORS,
    ['', ...COLOR_VARIES, ...COLOR_EXTRA_VARIES],
    handler,
    (id, vary): ColorValues => {
      const suffix = !vary ? '' : `-${vary}`;
      const name = id + suffix;
      const color = `var(--color-${name})`;
      const contrast = `var(${
        vary === ColorVaries.Contrast
          ? `--color-${id}`
          : `--color-${id}-contrast`
      })`;
      return {
        id,
        vary,
        suffix,
        name,
        color,
        contrast,
      };
    }
  );
}
export function generateGradientVaries(
  handler: ColorOrGradientVaryHandler<GradientValues>
) {
  return colorOrGradientVaries(
    COLORS,
    ['', ...COLOR_VARIES],
    handler,
    (id, vary): GradientValues => {
      const suffix = !vary ? '' : `-${vary}`;
      const name = id + suffix;
      const color = `var(--color-${name})`;
      const contrast = `var(${
        vary === ColorVaries.Contrast
          ? `--color-${id}`
          : `--color-${id}-contrast`
      })`;
      const gradient = `var(--gradient-${name})`;
      const gradientContrast = `var(${
        vary === ColorVaries.Contrast
          ? `--gradient-${id}`
          : `--gradient-${id}-contrast`
      })`;
      return {
        id,
        vary,
        suffix,
        name,
        color,
        contrast,
        gradient,
        gradientContrast,
      };
    }
  );
}

export function generateSizeVaries(handler: SizeVaryHandler) {
  return unsafeCSS(SIZES.map(size => handler(size)).join(''));
}

function factorVaries(handler: SizeFactorVaryHandler) {
  return unsafeCSS(
    [...BASIC_FACTORS, ...EXTRA_FACTORS].map(factor => handler(factor)).join('')
  );
}
export function generateBasicFactorVaries(handler: SizeFactorVaryHandler) {
  return unsafeCSS(
    BASIC_FACTORS.map(sizeFactor => handler(sizeFactor)).join('')
  );
}
export function generateSpaceVaries(handler: SizeFactorVaryHandler) {
  return factorVaries(handler);
}

export function generateFontTypeVaries(handler: FontTypeVaryHandler) {
  return unsafeCSS(FONT_TYPES.map(fontType => handler(fontType)).join(''));
}
export function generateFontSizeVaries(handler: SizeFactorVaryHandler) {
  return factorVaries(handler);
}
