"use strict";

const Lab = require("@hapi/lab");
const partial = require("..").partial;

const { expect } = require("@hapi/code");
const { it } = (exports.lab = Lab.script());

/**
 * Null values
 */
it("partial:null", (t) => expect(partial(null, null)).to.equal(true));

it("partial:null_vs_not_null", (t) => expect(partial(null, 0)).to.equal(false));

it("partial:not_null_vs_null", (t) => expect(partial(0, null)).to.equal(false));

/**
 * Primitive types
 */
it("partial:string", (t) =>
  expect(partial("This is a string!", "This is a string!")).to.equal(true));

it("partial:number", (t) => expect(partial(3.141592, 3.141592)).to.equal(true));

it("partial:boolean_false", (t) =>
  expect(partial(false, false)).to.equal(true));

it("partial:boolean_true", (t) => expect(partial(true, true)).to.equal(true));

it("partial:undefined", (t) =>
  expect(partial(undefined, undefined)).to.equal(true));

/**
 * RegExp
 */
it("partial:regexp", (t) =>
  expect(partial("hola k ase?", /k ase/)).to.equal(true));

it("partial:regexp_no_match", (t) =>
  expect(partial("hola k ase?", /hello world/)).to.equal(false));

/**
 * Functions
 */
it("partial:function", (t) =>
  expect(
    partial(18, function (x) {
      return x > 5;
    })
  ).to.equal(true));

it("partial:function_arrow", (t) =>
  expect(partial(18, (x) => x > 5)).to.equal(true));

it("partial:function_false", (t) =>
  expect(partial(18, (x) => x < 5)).to.equal(false));

/**
 * Objects
 */
it("partial:object_empty", (t) => expect(partial({}, {})).to.equal(true));

it("partial:object_equal", (t) =>
  expect(partial({ name: "oscar" }, { name: "oscar" })).to.equal(true));

it("partial:object_different", (t) =>
  expect(partial({ name: "pedro" }, { name: "oscar" })).to.equal(false));

it("partial:object_more_keys_value", (t) =>
  expect(partial({ name: "oscar", number: 18 }, { name: "oscar" })).to.equal(
    true
  ));

it("partial:object_more_keys_value2", (t) =>
  expect(partial({ name: "oscar", number: 18 }, { number: 18 })).to.equal(
    true
  ));

it("partial:object_more_keys_expected", (t) =>
  expect(partial({ name: "oscar" }, { name: "", number: 18 })).to.equal(false));

it("partial:object_with_regex_and_functions", (t) =>
  expect(
    partial({ name: "oscar", age: 23 }, { name: /os/, age: (x) => x > 18 })
  ).to.equal(true));

it("partial:object_with_regex_and_functions_fails", (t) =>
  expect(
    partial({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x > 18 })
  ).to.equal(false));

it("partial:object_with_regex_and_functions_fails_all", (t) =>
  expect(
    partial({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x < 18 })
  ).to.equal(false));

it("partial:object_same_lenght_different_keys", (t) =>
  expect(partial({ value: {} }, { league: {} })).to.equal(false));

// Falsy keys

it("partial:object_null_key_false", (t) =>
  expect(partial({}, { null: {} })).to.equal(false));

it("partial:object_null_key_true", (t) =>
  expect(partial({ null: {} }, { null: {} })).to.equal(true));

it("partial:object_undefined_key_false", (t) =>
  expect(partial({}, { undefined: {} })).to.equal(false));

it("partial:object_undefined_key_true", (t) =>
  expect(partial({ undefined: {} }, { undefined: {} })).to.equal(true));

it("partial:object_nan_key_false", (t) =>
  expect(partial({}, { NaN: {} })).to.equal(false));

it("partial:object_nan_key_true", (t) =>
  expect(partial({ NaN: {} }, { NaN: {} })).to.equal(true));

it("partial:object_zero_key_false", (t) =>
  expect(partial({}, { 0: {} })).to.equal(false));

it("partial:object_zero_key_true", (t) =>
  expect(partial({ 0: {} }, { 0: {} })).to.equal(true));

it("partial:object_emptystring_key_false", (t) =>
  expect(partial({}, { "": {} })).to.equal(false));

it("partial:object_emptystring_key_true", (t) =>
  expect(partial({ "": {} }, { "": {} })).to.equal(true));

it("partial:object_false_key_false", (t) =>
  expect(partial({}, { false: {} })).to.equal(false));

it("partial:object_false_key_true", (t) =>
  expect(partial({ false: {} }, { false: {} })).to.equal(true));

// Falsy values

it("partial:object_null_null_value_true", (t) =>
  expect(partial({ a: null }, { a: null })).to.equal(true));

it("partial:object_undefined_undefined_value_true", (t) =>
  expect(partial({ a: undefined }, { a: undefined })).to.equal(true));

it("partial:object_false_false_value_true", (t) =>
  expect(partial({ a: false }, { a: false })).to.equal(true));

it("partial:object_zero_zero_value_true", (t) =>
  expect(partial({ a: 0 }, { a: 0 })).to.equal(true));

it("partial:object_emptystring_emptystring_value_true", (t) =>
  expect(partial({ a: "" }, { a: "" })).to.equal(true));

it("partial:object_nan_nan_value_true", (t) =>
  expect(partial({ a: NaN }, { a: NaN })).to.equal(false));

it("partial:object_emptyobject_emptyobject_value_true", (t) =>
  expect(partial({ a: {} }, { a: {} })).to.equal(true));

it("partial:object_emptyarray_emptyarray_value_true", (t) =>
  expect(partial({ a: [] }, { a: [] })).to.equal(true));

/**
 * Arrays
 */
it("partial:array_empty", (t) => expect(partial([], [])).to.equal(true));

it("partial:array", (t) =>
  expect(partial([1, 2, "hola"], [1, 2, "hola"])).to.equal(true));

it("partial:array_different", (t) =>
  expect(partial([1, false, "hola"], [1, true, "adios"])).to.equal(false));

it("partial:array_left_more_values", (t) =>
  expect(partial([1, 2, "hola"], [1, 2])).to.equal(false));

it("partial:array_right_more_values", (t) =>
  expect(partial([1, 2], [1, 2, "hola"])).to.equal(false));

it("partial:array_with_objects", (t) =>
  expect(partial([1, { test: "aaa" }], [1, { test: "aaa" }])).to.equal(true));

it("partial:array_with_object_with_less_keys", (t) =>
  expect(partial([1, {}], [1, { test: "aaa" }])).to.equal(false));

it("partial:array_with_object_with_more_keys", (t) =>
  expect(partial([1, { test: "aaa" }], [1, {}])).to.equal(true));

it("partial:array_with_objects_different_value", (t) =>
  expect(partial([1, { test: "aaa" }], [1, { test: "b" }])).to.equal(false));

it("partial:array_with_objects_different_key", (t) =>
  expect(partial([1, { test: "aaa" }], [1, { test2: "aaa" }])).to.equal(false));

it("partial:array_with_objects_missing_string", (t) =>
  expect(partial([1, { key2: 33 }], [1, { test: "aaa", key2: 33 }])).to.equal(
    false
  ));

it("partial:array_with_objects_missing_int", (t) =>
  expect(
    partial([1, { test: "aaa" }], [1, { test: "aaa", key2: 33 }])
  ).to.equal(false));

/**
 * Maps
 */
it("partial:map_empty", (t) => expect(partial({}, new Map())).to.equal(true));

it("partial:map_equal", (t) =>
  expect(partial({ name: "oscar" }, new Map([["name", "oscar"]]))).to.equal(
    true
  ));

it("partial:map_different", (t) =>
  expect(partial({ name: "oscar" }, new Map([["name", "pedro"]]))).to.equal(
    false
  ));

it("partial:map_with_more_keys", (t) =>
  expect(
    partial({ name: "oscar", number: 18 }, new Map([["name", "oscar"]]))
  ).to.equal(true));

it("partial:map_with_less_keys", (t) =>
  expect(
    partial(
      { name: "oscar" },
      new Map([
        ["name", "oscar"],
        ["number", 18],
      ])
    )
  ).to.equal(false));

it("partial:map_with_regex_and_functions", (t) =>
  expect(
    partial(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /os/],
        ["age", (x) => x > 18],
      ])
    )
  ).to.equal(true));

it("partial:map_with_regex_and_functions_fails", (t) =>
  expect(
    partial(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /ped/],
        ["age", (x) => x > 18],
      ])
    )
  ).to.equal(false));

it("partial:map_with_regex_and_functions_fails_all", (t) =>
  expect(
    partial(
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
it("partial:set_empty", (t) => expect(partial([], new Set())).to.equal(true));

it("partial:set", (t) =>
  expect(partial([1, 2, "hola"], new Set([1, 2, "hola"]))).to.equal(true));

it("partial:set_different", (t) =>
  expect(partial([1, true, "adios"], new Set([1, false, "hola"]))).to.equal(
    false
  ));

it("partial:set_with_more_values", (t) =>
  expect(partial([1, 2], new Set([1, 2, "hola"]))).to.equal(false));

it("partial:set_with_less_values", (t) =>
  expect(partial([1, 2, "hola"], new Set([1, 2]))).to.equal(false));

/**
 * Native JSON types
 */
it("partial:types_number", (t) =>
  expect(partial(3.1415, Number)).to.equal(true));
it("partial:types_number_wrong", (t) =>
  expect(partial(3.1415, String)).to.equal(false));
it("partial:types_string", (t) =>
  expect(partial("a boring string", String)).to.equal(true));
it("partial:types_string_wrong", (t) =>
  expect(partial("a boring string", Boolean)).to.equal(false));
it("partial:types_boolean", (t) =>
  expect(partial(true, Boolean)).to.equal(true));
it("partial:types_boolean_wrong", (t) =>
  expect(partial(false, String)).to.equal(false));
it("partial:types_object", (t) => expect(partial({}, Object)).to.equal(true));
it("partial:types_array", (t) => expect(partial([], Array)).to.equal(true));
it("partial:types_object_wrong", (t) =>
  expect(partial([], Object)).to.equal(false));
it("partial:types_array_wrong", (t) =>
  expect(partial({}, Array)).to.equal(false));

/**
 * And everything together
 */
it("partial:everything_together", (t) =>
  expect(
    partial(
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
it("partial:bake:partial", (t) => {
  let partialbake = partial.bake({ name: { first: /[\w]*/ } }, true);
  return partialbake({ name: { first: "Walter", last: "White" } });
});
