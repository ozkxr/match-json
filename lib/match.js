'use strict';

const type = require('./type');

/**
 * Test a JSON object
 *
 * @param {String | Number | Boolean | Object | Array} value The value that will be tested.
 * @param {*} expected A pattern to test against the value provided.
 * @return {Boolean} The boolean result of the test.
 * @api public
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
 *
 * @param {*} expected A pattern to test against the value provided.
 * @returns {Function} A function with the expected patter predefined.
 * @api public
 */
match.bake = expected => value => match(value, expected);

/**
 * Compares two arrays
 *
 * @param {Array} array Array to be tested.
 * @param {Object} expected Pattern to test the array.
 * @return {Boolean} Result of the test.
 * @api private
 */
function compareArrays(array, expected) {
  if (array.length !== expected.length) return false;
  return array.every((item, index) => match(array[index], expected[index]));
}

/**
 * Compares two objects
 *
 * @param {Objet} object Object to be tested.
 * @param {Object} expected Pattern to test the object.
 * @return {Boolean} Result of the test.
 * @api private
 */
function compareObjects(object, expected) {
  if (!compareArrays(Object.keys(object), Object.keys(expected))) return false;
  return Object.keys(expected).every(key => match(object[key], expected[key]));
}

/**
 * Evaluate a function and throw an error if the result is not boolean
 *
 * @param {*} value A value that will be sended as a parameter to the function.
 * @param {Function} func A function to call.
 * @return {Boolean} The result of the function.
 * @api private
 */
function evaluateFunction(value, func) {
  let result = func.call(null, value);
  if (type(result) !== 'boolean') {
    throw new Error('Function provided should return a boolean');
  }
  return result;
}

module.exports = match;
