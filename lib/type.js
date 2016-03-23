'use strict';
/**
 * Returns a string with the value type.
 *
 * @param {*} value
 * @returns {String} Type of the value
 */
function type(value) {
  if (value instanceof RegExp) return 'regexp';
  if (value instanceof Array) return 'array';
  return typeof value;
}

module.exports = type;
