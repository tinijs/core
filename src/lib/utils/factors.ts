import { ClassInfo } from 'lit/directives/class-map.js';

import { FACTORS } from './varies';

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
