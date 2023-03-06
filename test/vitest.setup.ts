import { afterEach, beforeEach, describe, it } from 'vitest';

// Temporary workaround to make mocha-wrap work
global.afterEach = afterEach;
global.beforeEach = beforeEach;
global.describe = describe;
global.it = it;
