import {unsafeCSS, CSSResult} from 'lit';

type SizeVaryHandler = (size: string) => string;
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
}

export type ColorsWithoutDynamics = Exclude<
  Colors,
  | Colors.Dynamic
  | Colors.DynamicContrast
  | Colors.DynamicShade
  | Colors.DynamicShade2
  | Colors.DynamicShade3
  | Colors.DynamicShade4
  | Colors.DynamicShade5
  | Colors.DynamicTint
  | Colors.DynamicTint2
  | Colors.DynamicTint3
  | Colors.DynamicTint4
  | Colors.DynamicTint5
  | Colors.GradientDynamic
  | Colors.GradientDynamicContrast
  | Colors.GradientDynamicShade
  | Colors.GradientDynamicTint
>;

const SIZES = [
  'xxxs',
  'xxs',
  'xs',
  'ss',
  'sm',
  'md',
  'ml',
  'lg',
  'sl',
  'xl',
  'xxl',
  'xxxl',
];
const DYNAMIC_COLOR = 'dynamic';
const COLORS = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'dark',
  'medium',
  'light',
];
const COLOR_VARIES = ['contrast', 'shade', 'tint'];
const COLOR_EXTRA_VARIES = [
  'shade-2',
  'shade-3',
  'shade-4',
  'shade-5',
  'shade-6',
  'shade-7',
  'tint-2',
  'tint-3',
  'tint-4',
  'tint-5',
  'tint-6',
  'tint-7',
];

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
export enum Multipliers {
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
export enum Colors {
  Dynamic = 'dynamic',
  DynamicContrast = 'dynamic-contrast',
  DynamicShade = 'dynamic-shade',
  DynamicShade2 = 'dynamic-shade-2',
  DynamicShade3 = 'dynamic-shade-3',
  DynamicShade4 = 'dynamic-shade-4',
  DynamicShade5 = 'dynamic-shade-5',
  DynamicTint = 'dynamic-tint',
  DynamicTint2 = 'dynamic-tint-2',
  DynamicTint3 = 'dynamic-tint-3',
  DynamicTint4 = 'dynamic-tint-4',
  DynamicTint5 = 'dynamic-tint-5',
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
  GradientDynamic = 'gradient-dynamic',
  GradientDynamicContrast = 'gradient-dynamic-contrast',
  GradientDynamicShade = 'gradient-dynamic-shade',
  GradientDynamicTint = 'gradient-dynamic-tint',
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
}

function colorOrGradientVaries(
  colors: string[],
  varies: string[],
  handler: ColorOrGradientVaryHandler<any>,
  valueBuilder: ColorOrGradientValuesBuilder
) {
  return colors
    .map(id => varies.map(vary => handler(valueBuilder(id, vary))).join(''))
    .join('');
}
export function generateColorDynamic(
  handler: ColorOrGradientVaryHandler<ColorValues>,
  toString?: true
) {
  const data = colorOrGradientVaries(
    [DYNAMIC_COLOR],
    ['', ...COLOR_VARIES, ...COLOR_EXTRA_VARIES],
    handler,
    (id, vary): ColorValues => {
      const suffix = !vary ? '' : `-${vary}`;
      const name = id + suffix;
      const color = `var(--color-foreground${suffix})`;
      const contrast = `var(${
        vary === ColorVaries.Contrast
          ? '--color-foreground'
          : '--color-background'
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
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}
export function generateColorVaries(
  handler: ColorOrGradientVaryHandler<ColorValues>,
  toString?: true
) {
  const data = colorOrGradientVaries(
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
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}
export function generateColorDynamicAndVaries(
  handler: ColorOrGradientVaryHandler<ColorValues>,
  toString?: true
) {
  const dynamic = generateColorDynamic(handler, true) as unknown as string;
  const varies = generateColorVaries(handler, true) as unknown as string;
  const data = dynamic + varies;
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}
export function generateGradientDynamic(
  handler: ColorOrGradientVaryHandler<GradientValues>,
  toString?: true
) {
  const data = colorOrGradientVaries(
    [DYNAMIC_COLOR],
    ['', ...COLOR_VARIES],
    handler,
    (id, vary): GradientValues => {
      const suffix = !vary ? '' : `-${vary}`;
      const name = id + suffix;
      const gradient = `var(--gradient-foreground${suffix})`;
      const color = `var(--color-foreground${suffix})`;
      const contrast = `var(${
        vary === ColorVaries.Contrast
          ? '--color-foreground'
          : '--color-background'
      })`;
      return {
        id,
        vary,
        suffix,
        name,
        gradient,
        color,
        contrast,
      };
    }
  );
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}
export function generateGradientVaries(
  handler: ColorOrGradientVaryHandler<GradientValues>,
  toString?: true
) {
  const data = colorOrGradientVaries(
    COLORS,
    ['', ...COLOR_VARIES],
    handler,
    (id, vary): GradientValues => {
      const suffix = !vary ? '' : `-${vary}`;
      const name = id + suffix;
      const gradient = `var(--gradient-${name})`;
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
        gradient,
        color,
        contrast,
      };
    }
  );
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}
export function generateGradientDynamicAndVaries(
  handler: ColorOrGradientVaryHandler<GradientValues>,
  toString?: true
) {
  const dynamic = generateGradientDynamic(handler, true) as unknown as string;
  const varies = generateGradientVaries(handler, true) as unknown as string;
  const data = dynamic + varies;
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}

export function generateSizeVaries(handler: SizeVaryHandler, toString?: true) {
  const data = SIZES.map(size => handler(size)).join('');
  return (toString ? data : unsafeCSS(data)) as CSSResult;
}
