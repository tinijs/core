import { ClassInfo } from 'lit/directives/class-map.js';

import { VaryGroups, COLORS, BORDER_WIDTHS, BORDER_STYLES } from './varies';

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
