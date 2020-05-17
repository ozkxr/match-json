"use strict";

const Lab = require("@hapi/lab");
const partial = require("..").partial;

const { it } = (exports.lab = Lab.script());

/**
 * Null values
 */
it("partial:null", (t) => partial(null, null));

it("partial:null_vs_not_null", (t) => partial(null, 0));

it("partial:not_null_vs_null", (t) => partial(0, null));

/**
 * Primitive types
 */
it("partial:string", (t) => partial("This is a string!", "This is a string!"));

it("partial:number", (t) => partial(3.141592, 3.141592));

it("partial:boolean_false", (t) => partial(false, false));

it("partial:boolean_true", (t) => partial(false, false));

it("partial:undefined", (t) => partial(undefined, undefined));

/**
 * RegExp
 */
it("partial:regexp", (t) => partial("hola k ase?", /k ase/));

it("partial:regexp_no_match", (t) => partial("hola k ase?", /hello world/));

/**
 * Functions
 */
it("partial:function", (t) =>
  partial(18, function (x) {
    return x > 5;
  }));

it("partial:function_arrow", (t) => partial(18, (x) => x > 5));

it("partial:function_false", (t) => partial(18, (x) => x < 5));

/**
 * Objects
 */
it("partial:object_empty", (t) => partial({}, {}));

it("partial:object_equal", (t) =>
  partial({ name: "oscar" }, { name: "oscar" }));

it("partial:object_different", (t) =>
  partial({ name: "pedro" }, { name: "oscar" }));

it("partial:object_more_keys_value", (t) =>
  partial({ name: "oscar", number: 18 }, { name: "oscar" }));

it("partial:object_more_keys_expected", (t) =>
  partial({ name: "oscar" }, { name: "", number: 18 }));

it("partial:object_with_regex_and_functions", (t) =>
  partial({ name: "oscar", age: 23 }, { name: /os/, age: (x) => x > 18 }));

it("partial:object_with_regex_and_functions_fails", (t) =>
  partial({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x > 18 }));

it("partial:object_with_regex_and_functions_fails_all", (t) =>
  partial({ name: "oscar", age: 23 }, { name: /ped/, age: (x) => x < 18 }));

/**
 * Arrays
 */
it("partial:array_empty", (t) => partial([], []));

it("partial:array", (t) => partial([1, 2, "hola"], [1, 2, "hola"]));

it("partial:array_different", (t) =>
  partial([1, false, "hola"], [1, true, "adios"]));

it("partial:array_left_more_values", (t) => partial([1, 2, "hola"], [1, 2]));

it("partial:array_right_more_values", (t) => partial([1, 2], [1, 2, "hola"]));

/**
 * Maps
 */
it("partial:map_empty", (t) => partial({}, new Map()));

it("partial:map_equal", (t) =>
  partial({ name: "oscar" }, new Map([["name", "oscar"]])));

it("partial:map_different", (t) =>
  partial({ name: "oscar" }, new Map([["name", "pedro"]])));

it("partial:map_with_mote_keys", (t) =>
  partial(
    { name: "oscar" },
    new Map([
      ["name", "oscar"],
      ["number", 18],
    ])
  ));

it("partial:map_with_less_keys", (t) =>
  partial({ name: "", number: 18 }, new Map([["name", "oscar"]])));

it("partial:map_with_regex_and_functions", (t) =>
  partial(
    { name: "oscar", age: 23 },
    new Map([
      ["name", /os/],
      ["age", (x) => x > 18],
    ])
  ));

it("partial:map_with_regex_and_functions_fails", (t) =>
  partial(
    { name: "oscar", age: 23 },
    new Map([
      ["name", /ped/],
      ["age", (x) => x > 18],
    ])
  ));

it("partial:map_with_regex_and_functions_fails_all", (t) =>
  partial(
    { name: "oscar", age: 23 },
    new Map([
      ["name", /ped/],
      ["age", (x) => x < 18],
    ])
  ));

/**
 * Sets
 */
it("partial:set_empty", (t) => partial([], new Set()));

it("partial:set", (t) => partial([1, 2, "hola"], new Set([1, 2, "hola"])));

it("partial:set_different", (t) =>
  partial([1, true, "adios"], new Set([1, false, "hola"])));

it("partial:set_with_more_values", (t) =>
  partial([1, 2], new Set([1, 2, "hola"])));

it("partial:set_with_less_values", (t) =>
  partial([1, 2, "hola"], new Set([1, 2])));

/**
 * Native JSON types
 */
it("partial:types_number", (t) => partial(3.1415, Number));
it("partial:types_number_wrong", (t) => partial(3.1415, String));
it("partial:types_string", (t) => partial("a boring string", String));
it("partial:types_string_wrong", (t) => partial("a boring string", Boolean));
it("partial:types_boolean", (t) => partial(true, Boolean));
it("partial:types_boolean_wrong", (t) => partial(false, String));

/**
 * And everything together
 */
it("partial:everything_together", (t) =>
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
  ));

/**
 * Bake function
 */
it("partial:bake:partial", (t) => {
  let partialbake = partial.bake({ name: { first: /[\w]*/ } }, true);
  return partialbake({ name: { first: "Walter", last: "White" } });
});
