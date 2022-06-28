require('raf/polyfill');

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('', { url: 'http://localhost' });

global.window = jsdom.window;
global.document = jsdom.window.document;
global.HTMLElement = window.HTMLElement;
global.HTMLButtonElement = window.HTMLButtonElement;
Object.keys(global.document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
