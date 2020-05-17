"use strict";

const Lab = require("@hapi/lab");
const match = require("..");

const { it } = (exports.lab = Lab.script());

/**
 * Null values
 */
it("match:null", (t) => match(null, null));

it("match:null_vs_not_null", (t) => match(null, 0));

it("match:not_null_vs_null", (t) => match(0, null));

/**
 * Primitive types
 */
it("match:string", (t) =>
  match("This is a string!", "This is a string!"));

it("match:number", (t) => match(3.141592, 3.141592));

it("match:boolean_false", (t) => match(false, false));

it("match:boolean_true", (t) => match(false, false));

it("match:undefined", (t) => match(undefined, undefined));

/**
 * RegExp
 */
it("match:regexp", (t) => match("hola k ase?", /k ase/));

it("match:regexp_no_match", (t) =>
  match("hola k ase?", /hello world/));

/**
 * Functions
 */
it("match:function", (t) =>
  (
    match(18, function (x) {
      return x > 5;
    })
  ));

it("match:function_arrow", (t) => match(18, (x) => x > 5));

it("match:function_false", (t) => match(18, (x) => x < 5));

/**
 * Objects
 */
it("match:object_empty", (t) => match({}, {}));

it("match:object_equal", (t) =>
  match({ name: "oscar" }, { name: "oscar" }));

it("match:object_different", (t) =>
  match({ name: "pedro" }, { name: "oscar" }));

it("match:object_more_keys_value", (t) =>
  match({ name: "oscar", number: 18 }, { name: "oscar" }));

it("match:object_more_keys_expected", (t) =>
  match({ name: "oscar" }, { name: "", number: 18 }));

it("match:object_with_regex_and_functions", (t) =>
  (
    match({ name: "oscar", age: 23 }, { name: /os/, age: (x) => x > 18 })
  ));

it("match:object_with_regex_and_functions_fails", (t) =>
  (
    match({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x > 18 })
  ));

it("match:object_with_regex_and_functions_fails_all", (t) =>
  (
    match({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x < 18 })
  ));

/**
 * Arrays
 */
it("match:array_empty", (t) => match([], []));

it("match:array", (t) => match([1, 2, "hola"], [1, 2, "hola"]));

it("match:array_different", (t) =>
  match([1, false, "hola"], [1, true, "adios"]));

it("match:array_left_more_values", (t) =>
  match([1, 2, "hola"], [1, 2]));

it("match:array_right_more_values", (t) =>
  match([1, 2], [1, 2, "hola"]));

/**
 * Maps
 */
it("match:map_empty", (t) => match({}, new Map()));

it("match:map_equal", (t) =>
  match({ name: "oscar" }, new Map([["name", "oscar"]])));

it("match:map_different", (t) =>
  match({ name: "oscar" }, new Map([["name", "pedro"]])));

it("match:map_with_mote_keys", (t) =>
  (
    match(
      { name: "oscar" },
      new Map([
        ["name", "oscar"],
        ["number", 18],
      ])
    )
  ));

it("match:map_with_less_keys", (t) =>
  match({ name: "", number: 18 }, new Map([["name", "oscar"]])));

it("match:map_with_regex_and_functions", (t) =>
  (
    match(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /os/],
        ["age", (x) => x > 18],
      ])
    )
  ));

it("match:map_with_regex_and_functions_fails", (t) =>
  (
    match(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /ped/],
        ["age", (x) => x > 18],
      ])
    )
  ));

it("match:map_with_regex_and_functions_fails_all", (t) =>
  (
    match(
      { name: "oscar", age: 23 },
      new Map([
        ["name", /ped/],
        ["age", (x) => x < 18],
      ])
    )
  ));

/**
 * Sets
 */
it("match:set_empty", (t) => match([], new Set()));

it("match:set", (t) => match([1, 2, "hola"], new Set([1, 2, "hola"])));

it("match:set_different", (t) =>
  match([1, true, "adios"], new Set([1, false, "hola"])));

it("match:set_with_more_values", (t) =>
  match([1, 2], new Set([1, 2, "hola"])));

it("match:set_with_less_values", (t) =>
  match([1, 2, "hola"], new Set([1, 2])));

/**
 * Native JSON types
 */
it("match:types_number", (t) => match(3.1415, Number));
it("match:types_number_wrong", (t) => match(3.1415, String));
it("match:types_string", (t) => match("a boring string", String));
it("match:types_string_wrong", (t) =>
  match("a boring string", Boolean));
it("match:types_boolean", (t) => match(true, Boolean));
it("match:types_boolean_wrong", (t) => match(false, String));

/**
 * And everything together
 */
it("match:everything_together", (t) =>
  (
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
  ));

/**
 * Bake function
 */
it("match:bake", (t) => {
  let matchbake = match.bake({ name: { first: /[\w]*/, last: "White" } });
  return (matchbake({ name: { first: "Walter", last: "White" } }));
});
