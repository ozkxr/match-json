'use strict';

import test from'ava';
import match from '..';

/**
 * Null values
 */
test('match:null', t => t.true(match(null, null)));

test('match:null_vs_not_null', t => t.false(match(null, 0)));

test('match:not_null_vs_null', t => t.false(match(0, null)));

/**
 * Primitive types
 */
test('match:string', t => t.true(match('This is a string!', 'This is a string!')));

test('match:number', t => t.true(match(3.141592, 3.141592)));

test('match:boolean_false', t => t.true(match(false, false)));

test('match:boolean_true', t => t.true(match(false, false)));

test('match:undefined', t => t.true(match(undefined, undefined)));

/**
 * RegExp
 */
test('match:regexp', t => t.true(match('hola k ase?', /k ase/)));

test('match:regexp_no_match', t => t.false(match('hola k ase?', /hello world/)));

/**
 * Functions
 */
test('match:function', t => t.true(match(18, function(x) { return x > 5})));

test('match:function_arrow', t => t.true(match(18, x => x > 5)));

test('match:function_false', t => t.false(match(18, x => x < 5)));

/**
 * Objects
 */
test('match:object_empty', t => t.true(match({}, {})));

test('match:object_equal', t => t.true(match({ name: 'oscar' }, { name: 'oscar' })));

test('match:object_different', t => t.false(match({ name: 'pedro' }, { name: 'oscar' })));

test('match:object_more_keys_value', t => t.false(match({ name: 'oscar', number: 18 }, { name: 'oscar' })));

test('match:object_more_keys_expected', t => t.false(match({ name: 'oscar' }, { name: '', number: 18 })));

test('match:object_with_regex_and_functions', t => t.true(match({ name: 'oscar', age: 23 }, { name: /os/, age: x => x > 18 })));

test('match:object_with_regex_and_functions_fails', t => t.false(match({ name: 'oscar', age: 23 }, { name: /ped/, age: x => x > 18 })));

test('match:object_with_regex_and_functions_fails_all', t => t.false(match({ name: 'oscar', age: 23 }, { name: /ped/, age: x => x < 18 })));

/**
 * Arrays
 */
test('match:array_empty', t => t.true(match([], [])));

test('match:array', t => t.true(match([ 1, 2, 'hola' ], [ 1, 2, 'hola'])));

test('match:array_different', t => t.false(match([ 1, false, 'hola' ], [ 1, true, 'adios'])));

test('match:array_left_more_values', t => t.false(match([ 1, 2, 'hola' ], [ 1, 2 ])));

test('match:array_right_more_values', t => t.false(match([ 1, 2 ], [ 1, 2, 'hola' ])));

/**
 * Maps
 */
test('match:map_empty', t => t.true(match({}, new Map())));

test('match:map_equal', t => t.true(match({ name: 'oscar' }, new Map([[ 'name', 'oscar' ]]))));

test('match:map_different', t => t.false(match({ name: 'oscar' }, new Map([[ 'name', 'pedro' ]]))));

test('match:map_with_mote_keys', t => t.false(match({ name: 'oscar' }, new Map([[ 'name', 'oscar' ], [ 'number', 18 ]]))));

test('match:map_with_less_keys', t => t.false(match({ name: '', number: 18 }, new Map([[ 'name', 'oscar' ]]))));

test('match:map_with_regex_and_functions', t => t.true(match({ name: 'oscar', age: 23 }, new Map([[ 'name', /os/ ], [ 'age', x => x > 18 ]]))));

test('match:map_with_regex_and_functions_fails', t => t.false(match({ name: 'oscar', 'age': 23 }, new Map([[ 'name', /ped/ ], [ 'age', x => x > 18 ]]))));

test('match:map_with_regex_and_functions_fails_all', t => t.false(match({ name: 'oscar', age: 23 }, new Map([[ 'name', /ped/ ], [ 'age', x => x < 18 ]]))));

/**
 * Sets
 */
test('match:set_empty', t => t.true(match([], new Set())));

test('match:set', t => t.true(match([ 1, 2, 'hola' ], new Set([ 1, 2, 'hola' ]))));

test('match:set_different', t => t.false(match([ 1, true, 'adios' ], new Set([ 1, false, 'hola' ]))));

test('match:set_with_more_values', t => t.false(match([ 1, 2 ], new Set([ 1, 2, 'hola' ]))));

test('match:set_with_less_values', t => t.false(match([ 1, 2, 'hola' ], new Set([ 1, 2 ]))));

/**
 * Native JSON types
 */
test('match:types_number', t => t.true(match(3.1415, Number)));
test('match:types_number_wrong', t => t.false(match(3.1415, String)));
test('match:types_string', t => t.true(match('a boring string', String)));
test('match:types_string_wrong', t => t.false(match('a boring string', Boolean)));
test('match:types_boolean', t => t.true(match(true, Boolean)));
test('match:types_boolean_wrong', t => t.false(match(false, String)));

/**
 * And everything together
 */
test('match:everything_together', t => t.true(match({
        name: { first: 'Walter', last: 'White' },
        age: 51,
        breakingBad: true
      },
      {
        name: { first: /[\w]*/, last: 'White' },
        age: age => age > 18,
        breakingBad: Boolean
      })));

/**
 * Bake function
 */
 test('match:bake', t => {
   let matchbake = match.bake({name: { first: /[\w]*/, last: 'White' } });
   return t.true(matchbake({ name: { first: 'Walter', last: 'White' } }));
 });
