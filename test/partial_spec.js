'use strict';

import test from'ava';
import { partial } from '..';


/**
 * Null values
 */
test('partial:null', t => t.true(partial(null, null)));

test('partial:null_vs_not_null', t => t.false(partial(null, 0)));

test('partial:not_null_vs_null', t => t.false(partial(0, null)));

/**
 * Primitive types
 */
test('partial:string', t => t.true(partial('This is a string!', 'This is a string!')));

test('partial:number', t => t.true(partial(3.141592, 3.141592)));

test('partial:boolean_false', t => t.true(partial(false, false)));

test('partial:boolean_true', t => t.true(partial(false, false)));

test('partial:undefined', t => t.true(partial(undefined, undefined)));

/**
 * RegExp
 */
test('partial:regexp', t => t.true(partial('hola k ase?', /k ase/)));

test('partial:regexp_no_match', t => t.false(partial('hola k ase?', /hello world/)));

/**
 * Functions
 */
test('partial:function', t => t.true(partial(18, function(x) { return x > 5})));

test('partial:function_arrow', t => t.true(partial(18, x => x > 5)));

test('partial:function_false', t => t.false(partial(18, x => x < 5)));

/**
 * Objects
 */
test('partial:object_empty', t => t.true(partial({}, {})));

test('partial:object_equal', t => t.true(partial({ name: 'oscar' }, { name: 'oscar' })));

test('partial:object_different', t => t.false(partial({ name: 'pedro' }, { name: 'oscar' })));

test('partial:object_more_keys_value', t => t.true(partial({ name: 'oscar', number: 18 }, { name: 'oscar' })));

test('partial:object_more_keys_expected', t => t.false(partial({ name: 'oscar' }, { name: '', number: 18 })));

test('partial:object_with_regex_and_functions', t => t.true(partial({ name: 'oscar', age: 23 }, { name: /os/, age: x => x > 18 })));

test('partial:object_with_regex_and_functions_fails', t => t.false(partial({ name: 'oscar', age: 23 }, { name: /ped/, age: x => x > 18 })));

test('partial:object_with_regex_and_functions_fails_all', t => t.false(partial({ name: 'oscar', age: 23 }, { name: /ped/, age: x => x < 18 })));

/**
 * Arrays
 */
test('partial:array_empty', t => t.true(partial([], [])));

test('partial:array', t => t.true(partial([ 1, 2, 'hola' ], [ 1, 2, 'hola'])));

test('partial:array_different', t => t.false(partial([ 1, false, 'hola' ], [ 1, true, 'adios'])));

test('partial:array_left_more_values', t => t.false(partial([ 1, 2, 'hola' ], [ 1, 2 ])));

test('partial:array_right_more_values', t => t.false(partial([ 1, 2 ], [ 1, 2, 'hola' ])));

/**
 * Maps
 */
test('partial:map_empty', t => t.true(partial({}, new Map())));

test('partial:map_equal', t => t.true(partial({ name: 'oscar' }, new Map([[ 'name', 'oscar' ]]))));

test('partial:map_different', t => t.false(partial({ name: 'oscar' }, new Map([[ 'name', 'pedro' ]]))));

test('partial:map_with_mote_keys', t => t.false(partial({ name: 'oscar' }, new Map([[ 'name', 'oscar' ], [ 'number', 18 ]]))));

test('partial:map_with_less_keys', t => t.false(partial({ name: '', number: 18 }, new Map([[ 'name', 'oscar' ]]))));

test('partial:map_with_regex_and_functions', t => t.true(partial({ name: 'oscar', age: 23 }, new Map([[ 'name', /os/ ], [ 'age', x => x > 18 ]]))));

test('partial:map_with_regex_and_functions_fails', t => t.false(partial({ name: 'oscar', 'age': 23 }, new Map([[ 'name', /ped/ ], [ 'age', x => x > 18 ]]))));

test('partial:map_with_regex_and_functions_fails_all', t => t.false(partial({ name: 'oscar', age: 23 }, new Map([[ 'name', /ped/ ], [ 'age', x => x < 18 ]]))));

/**
 * Sets
 */
test('partial:set_empty', t => t.true(partial([], new Set())));

test('partial:set', t => t.true(partial([ 1, 2, 'hola' ], new Set([ 1, 2, 'hola' ]))));

test('partial:set_different', t => t.false(partial([ 1, true, 'adios' ], new Set([ 1, false, 'hola' ]))));

test('partial:set_with_more_values', t => t.false(partial([ 1, 2 ], new Set([ 1, 2, 'hola' ]))));

test('partial:set_with_less_values', t => t.false(partial([ 1, 2, 'hola' ], new Set([ 1, 2 ]))));

/**
 * Native JSON types
 */
test('partial:types_number', t => t.true(partial(3.1415, Number)));
test('partial:types_number_wrong', t => t.false(partial(3.1415, String)));
test('partial:types_string', t => t.true(partial('a boring string', String)));
test('partial:types_string_wrong', t => t.false(partial('a boring string', Boolean)));
test('partial:types_boolean', t => t.true(partial(true, Boolean)));
test('partial:types_boolean_wrong', t => t.false(partial(false, String)));

/**
 * And everything together
 */
test('partial:everything_together', t => t.true(partial({
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
 test('partial:bake:partial', t => {
  let partialbake = partial.bake({name: { first: /[\w]*/ } }, true);
  return t.true(partialbake({ name: { first: 'Walter', last: 'White' } }));
});
