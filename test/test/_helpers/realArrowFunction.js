try {
  module.exports = require('./untranspiledArrowFunction');
} catch (e) {
  module.exports = (x) => () => x;
}
