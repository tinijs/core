import {ClassInfo} from 'lit/directives/class-map.js';

import {
  VaryGroups,
  FACTORS,
  COLORS,
  BORDER_WIDTHS,
  BORDER_STYLES,
  OUTLINE_WIDTHS,
  OUTLINE_STYLES,
} from './varies.js';

export function mix(...params: string[]) {
  const method =
    params[0]?.substring(0, 3) !== 'in ' ? 'in oklab' : params.shift();
  return `color-mix(${method}, ${params.slice(0, 2).join(', ')})`;
}

export function darken(color: string, amount = 0.1) {
  return mix(color, `black ${amount * 100}%`);
}

export function brighten(color: string, amount = 0.1) {
  return mix(color, `white ${amount * 100}%`);
}

export function opacity(color: string, amount = 0.1) {
  return mix(color, `transparent ${(1 - amount) * 100}%`);
}

export function factorsToClassInfo(
  prefix: string,
  factors?: string
): ClassInfo {
  if (!factors) return {};
  const list = factors.split(' ').filter(item => ~FACTORS.indexOf(item as any));
  if (list.length === 4) {
    return {
      [`${prefix}-top-${list[0]}`]: true,
      [`${prefix}-right-${list[1]}`]: true,
      [`${prefix}-bottom-${list[2]}`]: true,
      [`${prefix}-left-${list[3]}`]: true,
    };
  } else if (list.length === 3) {
    return {
      [`${prefix}-top-${list[0]}`]: true,
      [`${prefix}-right-${list[1]}`]: true,
      [`${prefix}-bottom-${list[2]}`]: true,
      [`${prefix}-left-${list[1]}`]: true,
    };
  } else if (list.length === 2) {
    return {
      [`${prefix}-top-${list[0]}`]: true,
      [`${prefix}-right-${list[1]}`]: true,
      [`${prefix}-bottom-${list[0]}`]: true,
      [`${prefix}-left-${list[1]}`]: true,
    };
  } else if (list.length === 1) {
    return {
      [`${prefix}-top-${list[0]}`]: true,
      [`${prefix}-right-${list[0]}`]: true,
      [`${prefix}-bottom-${list[0]}`]: true,
      [`${prefix}-left-${list[0]}`]: true,
    };
  } else {
    return {};
  }
}

export function borderToClassInfo(border?: string): ClassInfo {
  if (!border) return {};
  const list = border.split(' ');
  if (
    list.length === 3 &&
    ~BORDER_WIDTHS.indexOf(list[0] as any) &&
    ~BORDER_STYLES.indexOf(list[1] as any) &&
    ~COLORS.indexOf(list[2] as any)
  ) {
    return {
      [`${VaryGroups.BorderWidth}-${list[0]}`]: true,
      [`${VaryGroups.BorderStyle}-${list[1]}`]: true,
      [`${VaryGroups.BorderColor}-${list[2]}`]: true,
    };
  } else if (list.length === 2) {
    if (
      ~BORDER_WIDTHS.indexOf(list[0] as any) &&
      ~BORDER_STYLES.indexOf(list[1] as any)
    ) {
      return {
        [`${VaryGroups.BorderWidth}-${list[0]}`]: true,
        [`${VaryGroups.BorderStyle}-${list[1]}`]: true,
      };
    } else if (
      ~BORDER_STYLES.indexOf(list[0] as any) &&
      ~COLORS.indexOf(list[1] as any)
    ) {
      return {
        [`${VaryGroups.BorderStyle}-${list[0]}`]: true,
        [`${VaryGroups.BorderColor}-${list[1]}`]: true,
      };
    } else {
      return {};
    }
  } else if (list.length === 1) {
    if (~BORDER_WIDTHS.indexOf(list[0] as any)) {
      return {
        [`${VaryGroups.BorderWidth}-${list[0]}`]: true,
      };
    } else if (~BORDER_STYLES.indexOf(list[0] as any)) {
      return {
        [`${VaryGroups.BorderStyle}-${list[0]}`]: true,
      };
    } else if (~COLORS.indexOf(list[0] as any)) {
      return {
        [`${VaryGroups.BorderColor}-${list[0]}`]: true,
      };
    } else {
      return {};
    }
  } else {
    return {};
  }
}

export function outlineToClassInfo(outline?: string): ClassInfo {
  if (!outline) return {};
  const list = outline.split(' ');
  if (
    list.length === 3 &&
    ~OUTLINE_WIDTHS.indexOf(list[0] as any) &&
    ~OUTLINE_STYLES.indexOf(list[1] as any) &&
    ~COLORS.indexOf(list[2] as any)
  ) {
    return {
      [`${VaryGroups.OutlineWidth}-${list[0]}`]: true,
      [`${VaryGroups.OutlineStyle}-${list[1]}`]: true,
      [`${VaryGroups.OutlineColor}-${list[2]}`]: true,
    };
  } else if (list.length === 2) {
    if (
      ~OUTLINE_WIDTHS.indexOf(list[0] as any) &&
      ~OUTLINE_STYLES.indexOf(list[1] as any)
    ) {
      return {
        [`${VaryGroups.OutlineWidth}-${list[0]}`]: true,
        [`${VaryGroups.OutlineStyle}-${list[1]}`]: true,
      };
    } else if (
      ~OUTLINE_STYLES.indexOf(list[0] as any) &&
      ~COLORS.indexOf(list[1] as any)
    ) {
      return {
        [`${VaryGroups.OutlineStyle}-${list[0]}`]: true,
        [`${VaryGroups.OutlineColor}-${list[1]}`]: true,
      };
    } else {
      return {};
    }
  } else if (list.length === 1) {
    if (~OUTLINE_WIDTHS.indexOf(list[0] as any)) {
      return {
        [`${VaryGroups.OutlineWidth}-${list[0]}`]: true,
      };
    } else if (~OUTLINE_STYLES.indexOf(list[0] as any)) {
      return {
        [`${VaryGroups.OutlineStyle}-${list[0]}`]: true,
      };
    } else if (~COLORS.indexOf(list[0] as any)) {
      return {
        [`${VaryGroups.OutlineColor}-${list[0]}`]: true,
      };
    } else {
      return {};
    }
  } else {
    return {};
  }
}
