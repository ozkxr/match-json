"use strict";

const Lab = require("@hapi/lab");
const type = require("../lib/type");

const { it } = (exports.lab = Lab.script());

it("type:string", (t) => type("This is a string!") === "string");

it("type:number", (t) => type(3.141592) === "number");

it("type:boolean_false", (t) => type(false) === "boolean");

it("type:boolean_true", (t) => type(true) === "boolean");

it("type:undefined", (t) => type(undefined) === "undefined");

it("type:regexp", (t) => type(/abc/) === "regexp");

it("type:regex_whith_flags", (t) => type(/abc/gi) === "regexp");

it("type:function", (t) => type(function () {}) === "function");

it("type:object", (t) => type({ prop: "value" }) === "object");

it("type:object_with_constructor", (t) => type(new Object()) === "object");

it("type:array", (t) => type([1, 2]) === "array");

it("type:map", (t) => type(new Map() === "map"));

it("type:set", (t) => type(new Set() === "set"));
