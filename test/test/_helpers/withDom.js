require('raf/polyfill');

const { jsdom } = require('jsdom');

global.document = jsdom('');
global.window = global.document.defaultView;
Object.keys(global.document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
