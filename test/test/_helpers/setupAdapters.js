const util = require('util');
const Enzyme = require('enzyme');
const wrap = require('mocha-wrap');
const resetWarningCache = require('prop-types').checkPropTypes.resetWarningCache;

const Adapter = require('./adapter');

Enzyme.configure({ adapter: new Adapter() });

/* eslint-disable no-console */

const origWarn = console.warn;
const origError = console.error;
wrap.register(function withConsoleThrows() {
  return this.withOverrides(
    () => console,
    () => ({
      error(msg) {
        origError.apply(console, arguments);
        throw new EvalError(arguments.length > 1 ? util.format.apply(util, arguments) : msg);
      },
      warn(msg) {
        origWarn.apply(console, arguments);
        throw new EvalError(arguments.length > 1 ? util.format.apply(util, arguments) : msg);
      },
    }),
  ).extend('with console throws', {
    beforeEach() {
      resetWarningCache();
    },
    afterEach() {
      resetWarningCache();
    },
  });
});
