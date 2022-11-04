module.exports = function (fn) {
  return function () {
    return fn.apply(null, [this].concat(Array.prototype.slice.call(arguments)));
  };
};
