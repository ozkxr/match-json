'use strict';

const test = require('ava');
const match = require('../');

/*
 * Null values
 */
test('match:null', t => t.true(match(null, null)));

test('match:null_vs_not_null', t => t.false(match(null, 0)));

test('match:not_null_vs_null', t => t.false(match(0, null)));

/*
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

/**expected => value => match(value, expected);
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

test('match:object_more_keys_right', t => t.false(match({ name: 'oscar', number: 18 }, { name: 'oscar' })));

test('match:object_more_keys_left', t => t.false(match({ name: 'oscar' }, { name: '', number: 18 })));

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

test('match:array_right_more_values', t => t.false(match([ 1, 2 ], [ 1, 2, 'hola'])));

/**
 * And everythong together
 */
test('match:everything_together', t => t.true(match({
        name: { first: 'Walter', last: 'White' },
        age: 51
      },
      {
        name: { first: /[\w]*/, last: 'White' },
        age: age => age > 18
      })));

/**
 * Bake function
 */
 test('match:bake', t => {
   let matchbake = match.bake({name: { first: /[\w]*/, last: 'White' } });
   return matchbake({ name: { first: /[\w]*/, last: 'White' } });
 });
