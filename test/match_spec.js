"use strict";

const Lab = require("@hapi/lab");
const match = require("..");

const { expect } = require("@hapi/code");
const { it } = (exports.lab = Lab.script());

/**
 * Null values
 */
it("match:null", (t) => expect(match(null, null)).to.equal(true));

it("match:null_vs_not_null", (t) => expect(match(null, 0)).to.equal(false));

it("match:not_null_vs_null", (t) => expect(match(0, null)).to.equal(false));

/**
 * Primitive types
 */
it("match:string", (t) =>
  expect(match("This is a string!", "This is a string!")).to.equal(true));

it("match:number", (t) => expect(match(3.141592, 3.141592)).to.equal(true));

it("match:boolean_false", (t) => expect(match(false, false)).to.equal(true));

it("match:boolean_true", (t) => expect(match(true, true)).to.equal(true));

it("match:undefined", (t) =>
  expect(match(undefined, undefined)).to.equal(true));

/**
 * RegExp
 */
it("match:regexp", (t) => expect(match("hola k ase?", /k ase/)).to.equal(true));

it("match:regexp_no_match", (t) =>
  expect(match("hola k ase?", /hello world/)).to.equal(false));

/**
 * Functions
 */
it("match:function", (t) =>
  expect(
    match(18, function (x) {
      return x > 5;
    })
  ).to.equal(true));

it("match:function_arrow", (t) =>
  expect(match(18, (x) => x > 5)).to.equal(true));

it("match:function_false", (t) =>
  expect(match(18, (x) => x < 5)).to.equal(false));

/**
 * Objects
 */
it("match:object_empty", (t) => expect(match({}, {})).to.equal(true));

it("match:object_equal", (t) =>
  expect(match({ name: "oscar" }, { name: "oscar" })).to.equal(true));

it("match:object_different", (t) =>
  expect(match({ name: "pedro" }, { name: "oscar" })).to.equal(false));

it("match:object_more_keys_value", (t) =>
  expect(match({ name: "oscar", number: 18 }, { name: "oscar" })).to.equal(
    false
  ));

it("match:object_more_keys_expected", (t) =>
  expect(match({ name: "oscar" }, { name: "", number: 18 })).to.equal(false));

it("match:object_with_regex_and_functions", (t) =>
  expect(
    match({ name: "oscar", age: 23 }, { name: /os/, age: (x) => x > 18 })
  ).to.equal(true));

it("match:object_with_regex_and_functions_fails", (t) =>
  expect(
    match({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x > 18 })
  ).to.equal(false));

it("match:object_with_regex_and_functions_fails_all", (t) =>
  expect(
    match({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x < 18 })
  ).to.equal(false));

it("match:object_same_lenght_different_keys", (t) =>
  expect(match({ value: {} }, { league: {} })).to.equal(false));

// Falsy keys

it("match:object_null_key_false", (t) =>
  expect(match({ null: {} }, {})).to.equal(false));

it("match:object_null_key_true", (t) =>
  expect(match({ null: {} }, { null: {} })).to.equal(true));

it("match:object_undefined_key_false", (t) =>
  expect(match({ undefined: {} }, {})).to.equal(false));

it("match:object_undefined_key_true", (t) =>
  expect(match({ undefined: {} }, { undefined: {} })).to.equal(true));

it("match:object_nan_key_false", (t) =>
  expect(match({ NaN: {} }, {})).to.equal(false));

it("match:object_nan_key_true", (t) =>
  expect(match({ NaN: {} }, { NaN: {} })).to.equal(true));

it("match:object_zero_key_false", (t) =>
  expect(match({ 0: {} }, {})).to.equal(false));

it("match:object_zero_key_true", (t) =>
  expect(match({ 0: {} }, { 0: {} })).to.equal(true));

it("match:object_emptystring_key_false", (t) =>
  expect(match({ "": {} }, {})).to.equal(false));

it("match:object_emptystring_key_true", (t) =>
  expect(match({ "": {} }, { "": {} })).to.equal(true));

it("match:object_false_key_false", (t) =>
  expect(match({ false: {} }, {})).to.equal(false));

it("match:object_false_key_true", (t) =>
  expect(match({ false: {} }, { false: {} })).to.equal(true));

// Falsy values

it("match:object_null_null_value_true", (t) =>
  expect(match({ a: null }, { a: null })).to.equal(true));

it("match:object_undefined_undefined_value_true", (t) =>
  expect(match({ a: undefined }, { a: undefined })).to.equal(true));

it("match:object_false_false_value_true", (t) =>
  expect(match({ a: false }, { a: false })).to.equal(true));

it("match:object_zero_zero_value_true", (t) =>
  expect(match({ a: 0 }, { a: 0 })).to.equal(true));

it("match:object_emptystring_emptystring_value_true", (t) =>
  expect(match({ a: "" }, { a: "" })).to.equal(true));

it("match:object_nan_nan_value_true", (t) =>
  expect(match({ a: NaN }, { a: NaN })).to.equal(false));

it("match:object_emptyobject_emptyobject_value_true", (t) =>
  expect(match({ a: {} }, { a: {} })).to.equal(true));

it("match:object_emptyarray_emptyarray_value_true", (t) =>
  expect(match({ a: [] }, { a: [] })).to.equal(true));

/**
 * Arrays
 */
it("match:array_empty", (t) => expect(match([], [])).to.equal(true));

it("match:array", (t) =>
  expect(match([1, 2, "hola"], [1, 2, "hola"])).to.equal(true));

it("match:array_different", (t) =>
  expect(match([1, false, "hola"], [1, true, "adios"])).to.equal(false));

it("match:array_left_more_values", (t) =>
  expect(match([1, 2, "hola"], [1, 2])).to.equal(false));

it("match:array_right_more_values", (t) =>
  expect(match([1, 2], [1, 2, "hola"])).to.equal(false));

it("match:array_with_object_with_less_keys", (t) =>
  expect(match([1, {}], [1, { test: "aaa" }])).to.equal(false));

it("match:array_with_object_with_more_keys", (t) =>
  expect(match([1, { test: "aaa" }], [1, {}])).to.equal(false));

it("match:array_with_objects_different_value", (t) =>
  expect(match([1, { test: "aaa" }], [1, { test: "b" }])).to.equal(false));

it("match:array_with_objects_same", (t) =>
  expect(match([333, { test: "aaa" }], [333, { test: "aaa" }])).to.equal(true));

it("match:object_with_array_same", (t) =>
  expect(
    match({ a: [333, { test: "aaa" }] }, { a: [333, { test: "aaa" }] })
  ).to.equal(true));

it("match:array_same", (t) =>
  expect(match([333, 222], [333, 222])).to.equal(true));

it("match:array_with_objects_different_key", (t) =>
  expect(match([1, { test: "aaa" }], [1, { test2: "aaa" }])).to.equal(false));

it("match:array_with_objects_missing_string", (t) =>
  expect(match([1, { key2: 33 }], [1, { test: "aaa", key2: 33 }])).to.equal(
    false
  ));

it("match:array_with_objects_missing_int", (t) =>
  expect(match([1, { test: "aaa" }], [1, { test: "aaa", key2: 33 }])).to.equal(
    false
  ));

/**
 * Maps
 */
it("match:map_empty", (t) => expect(match({}, new Map())).to.equal(true));

it("match:map_equal", (t) =>
  expect(match({ name: "oscar" }, new Map([["name", "oscar"]]))).to.equal(
    true
  ));

it("match:map_different", (t) =>
  expect(match({ name: "oscar" }, new Map([["name", "pedro"]]))).to.equal(
    false
  ));

it("match:map_with_more_keys", (t) =>
  expect(
    match({ name: "oscar", number: 18 }, new Map([["name", "oscar"]]))
  ).to.equal(false));

it("match:map_with_less_keys", (t) =>
  expect(
    match(
      { name: "oscar" },
      new Map([
        ["name", "oscar"],
        ["number", 18],
      ])
    )
  ).to.equal(false));

it("match:map_with_regex_and_functions", (t) =>
  expect(
    match(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /os/],
        ["age", (x) => x > 18],
      ])
    )
  ).to.equal(true));

it("match:map_with_regex_and_functions_fails", (t) =>
  expect(
    match(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /ped/],
        ["age", (x) => x > 18],
      ])
    )
  ).to.equal(false));

it("match:map_with_regex_and_functions_fails_all", (t) =>
  expect(
    match(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /ped/],
        ["age", (x) => x < 18],
      ])
    )
  ).to.equal(false));

/**
 * Sets
 */
it("match:set_empty", (t) => expect(match([], new Set())).to.equal(true));

it("match:set", (t) =>
  expect(match([1, 2, "hola"], new Set([1, 2, "hola"]))).to.equal(true));

it("match:set_different", (t) =>
  expect(match([1, true, "adios"], new Set([1, false, "hola"]))).to.equal(
    false
  ));

it("match:set_with_more_values", (t) =>
  expect(match([1, 2], new Set([1, 2, "hola"]))).to.equal(false));

it("match:set_with_less_values", (t) =>
  expect(match([1, 2, "hola"], new Set([1, 2]))).to.equal(false));

/**
 * Native JSON types
 */
it("match:types_number", (t) => expect(match(3.1415, Number)).to.equal(true));
it("match:types_number_wrong", (t) =>
  expect(match(3.1415, String)).to.equal(false));
it("match:types_string", (t) =>
  expect(match("a boring string", String)).to.equal(true));
it("match:types_string_wrong", (t) =>
  expect(match("a boring string", Boolean)).to.equal(false));
it("match:types_boolean", (t) => expect(match(true, Boolean)).to.equal(true));
it("match:types_boolean_wrong", (t) =>
  expect(match(false, String)).to.equal(false));
it("match:types_object", (t) => expect(match({}, Object)).to.equal(true));
it("match:types_array", (t) => expect(match([], Array)).to.equal(true));
it("match:types_object_wrong", (t) =>
  expect(match([], Object)).to.equal(false));
it("match:types_array_wrong", (t) => expect(match({}, Array)).to.equal(false));

/**
 * And everything together
 */
it("match:everything_together", (t) =>
  expect(
    match(
      {
        name: { first: "Walter", last: "White" },
        age: 51,
        breakingBad: true,
      },
      {
        name: { first: /[\w]*/, last: "White" },
        age: (age) => age > 18,
        breakingBad: Boolean,
      }
    )
  ).to.equal(true));

/**
 * Bake function
 */
it("match:bake", (t) => {
  let matchbake = match.bake({ name: { first: /[\w]*/, last: "White" } });
  return matchbake({ name: { first: "Walter", last: "White" } });
});
