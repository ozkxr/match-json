"use strict";

const type = require("./type");

/**
 * Tests JSON objects with a flag for partial mode.
 *
 * @param {String | Number | Boolean | Object | Array} value The value that will be tested.
 * @param {*} expected A pattern to test against the value provided.
 * @param {Boolean} partialMode An optional flag to set or unset partial mode.
 * @return {Boolean} The boolean result of the test.
 * @api private
 */
function matchCore(value, expected, partialModeFlag) {
  if (value === null) return expected === null;
  if (expected === null) return value === null;
  let partialMode = partialModeFlag || false;
  switch (type(expected)) {
    case "string":
    case "number":
    case "boolean":
    case "undefined":
      return value === expected;
    case "regexp":
      return expected.test(value);
    case "function":
      return evaluateFunction(value, expected);
    case "object":
      return compareObjects(value, expected, partialMode);
    case "array":
      return compareArrays(value, expected, partialMode);
    case "map":
      return compareObjects(value, mapToObject(expected), partialMode);
    case "set":
      return compareArrays(value, Array.from(expected), partialMode);
    default:
      return false;
  }
}

/**
 * Compares two arrays
 *
 * @param {Array} array Array to be tested.
 * @param {Object} expected Pattern to test the array.
 * @return {Boolean} Result of the test.
 * @api private
 */
function compareArrays(array, expected, partialMode) {
  if (array.length !== expected.length) return false;
  return expected.every((item, index) =>
    matchCore(array[index], expected[index], partialMode)
  );
}

/**
 * Compares two objects
 *
 * @param {Objet} object Object to be tested.
 * @param {Object} expected Pattern to test the object.
 * @return {Boolean} Result of the test.
 * @api private
 */
function compareObjects(object, expected, partialMode) {
  let expectedKeys = Object.keys(expected);
  let actualKeys = Object.keys(object);
  if (!partialMode && actualKeys.length !== expectedKeys.length) return false;
  if (expectedKeys.some((key) => !actualKeys.includes(key))) return false;
  return expectedKeys.every((key) =>
    matchCore(object[key], expected[key], partialMode)
  );
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
  let result;
  switch (func) {
    case Number:
      result = type(value) === "number";
      break;
    case String:
      result = type(value) === "string";
      break;
    case Boolean:
      result = type(value) === "boolean";
      break;
    case Object:
      result = type(value) === "object";
      break;
    case Array:
      result = type(value) === "array";
      break;
    default:
      result = func.call(null, value);
  }
  if (type(result) !== "boolean") {
    throw new Error("Function provided should return a boolean");
  }
  return result;
}

/**
 * Transform a Map into an object literal
 *
 * @param {Map} map A map to be transformed.
 * @return {Object} The transformed object.
 * @api private
 */
function mapToObject(map) {
  const obj = {};
  for (let [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

/**
 * Tests JSON objects.
 *
 * @param {String | Number | Boolean | Object | Array} value The value that will be tested.
 * @param {*} expected A pattern to test against the value provided.
 * @return {Boolean} The boolean result of the test.
 * @api public
 */
module.exports = (value, expected) => matchCore(value, expected, false);

/**
 * Makes a function to tests JSON objects
 * with a predefined test pattern.
 *
 * @param {*} expected A pattern to test against the value provided.
 * @returns {Function} A function with the expected patter predefined.
 * @api public
 */
module.exports.bake = (expected) => (value) =>
  matchCore(value, expected, false);

/**
 * Tests JSON objects with partial mode enabled.
 *
 * @param {String | Number | Boolean | Object | Array} value The value that will be tested.
 * @param {*} expected A pattern to test against the value provided.
 * @return {Boolean} The boolean result of the test.
 * @api public
 */
module.exports.partial = (value, expected) => matchCore(value, expected, true);

/**
 * Makes a function to tests JSON objects
 * with a predefined test pattern and partial mode enabled.
 *
 * @param {*} expected A pattern to test against the value provided.
 * @returns {Function} A function with the expected patter predefined.
 * @api public
 */
module.exports.partial.bake = (expected) => (value) =>
  matchCore(value, expected, true);
