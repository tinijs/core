import {test, expect} from 'vitest';

import {MODULE_NAME} from './common.js';

test('MODULE_NAME', () => {
  expect(MODULE_NAME).toBe('core');
});
