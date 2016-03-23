'use strict';

const type = require('./type');

/**
 * Test a JSON object
 *
 * @param value The value that will be tested.
 * @param expected The param 'value' will be tested against this.
 * @return {Boolean} The result of the test.
 */
function match(value, expected) {
  if (value === null) return expected === null;
  if (expected === null) return value === null;
  switch (type(expected)) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return value === expected;
    case 'regexp':
      return expected.test(value);
    case 'function':
      return evaluateFunction(value, expected); // eslint-disable-line no-use-before-define
    case 'object':
      return compareObjects(value, expected); // eslint-disable-line no-use-before-define
    case 'array':
      return compareArrays(value, expected); // eslint-disable-line no-use-before-define
    default:
      return false;
  }
}

/**
 * Make a function which test a JSON object
 * @returns {Function}
 */
match.bake = expected => value => match(value, expected);

/**
 * Compares two arrays
 */

function compareArrays(array, expected) {
  if (array.length !== expected.length) return false;
  return array.reduce((previous, current, index) => {
    return match(array[index], expected[index]) && previous;
  }, true);
}

/**
 * Compares two objects
 */
function compareObjects(object, expected) {
  if (!compareArrays(Object.keys(object), Object.keys(expected))) return false;
  return Object.keys(expected).reduce((previous, current) => {
    return match(object[current], expected[current]) && previous;
  }, true);
}

/**
 * Evaluate a function and throw an error if the result is not boolean
 */
function evaluateFunction(value, func) {
  let result = func.call(null, value);
  if (typeof result !== 'boolean') {
    throw new Error('Function provided should return a boolean');
  }
  return result;
}

module.exports = match;
