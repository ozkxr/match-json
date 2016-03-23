'use strict';

const test = require('ava');
const type = require('../lib/type');

test('type:string', t => t.true(type('This is a string!') === 'string'));

test('type:number', t => t.true(type(3.141592) === 'number'));

test('type:boolean_false', t => t.true(type(false) === 'boolean'));

test('type:boolean_true', t => t.true(type(true) === 'boolean'));

test('type:undefined', t => t.true(type(undefined) === 'undefined'));

test('type:regexp', t => t.true(type(/abc/) === 'regexp'));

test('type:regex_whith_flags', t => t.true(type(/abc/ig) === 'regexp'));

test('type:function', t => t.true(type(function(){}) === 'function'));

test('type:object', t => t.true(type({ prop: 'value' }) === 'object'));

test('type:array', t => t.true(type( [ 1, 2 ]) === 'array'));
