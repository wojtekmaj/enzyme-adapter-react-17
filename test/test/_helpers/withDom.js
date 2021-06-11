require('raf/polyfill');

if (!global.document) {
  try {
    // eslint-disable-next-line global-require
    const { jsdom } = require('jsdom'); // could throw

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
  } catch (e) {
    // jsdom is not supported
    if (e.message === "Cannot find module 'jsdom'") {
      console.error('[enzyme/withDom] Error: missing required module "jsdom"');
      console.error('[enzyme/withDom] To fix this you must run:');
      console.error('[enzyme/withDom]   npm install jsdom --save-dev');
    } else {
      console.error(`[enzyme withDom] ${e.stack || e.message}`);
    }
  }
}
