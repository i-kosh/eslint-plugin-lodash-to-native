"use strict";

const rule = require("../../../lib/rules/map");
const eslint = require("eslint");
const RuleTester = eslint.RuleTester;

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 12 } });

ruleTester.run("map", rule, {
  valid: [
    {
      code: "_.map({}, function() {})",
    },

    {
      code: `
        const obj = {};
        _.map(obj, () => {});
      `,
    },

    {
      code: `
        const obj = new Object();
        _.map(obj, () => {});
      `,
    },

    {
      code: `
        _ = {map: () => []};
        var m = _.map([], fn);
      `,
    },
  ],

  invalid: [
    {
      code: "_.map([], function() {})",
      errors: ["Сдесь можно использовать нативный `Array.map`"],
      output: "[].map(function() {})",
    },

    {
      code: `
        const arr = [];
        _.map(arr, function() {})
      `,
      errors: ["Сдесь можно использовать нативный `Array.map`"],
      output: `
        const arr = [];
        arr.map(function() {})
      `,
    },

    {
      code: `
        const arr = new Array();
        _.map(arr, function() {})
      `,
      errors: ["Сдесь можно использовать нативный `Array.map`"],
      output: `
        const arr = new Array();
        arr.map(function() {})
      `,
    },

    {
      code: `
        _.map(new Array(), function() {})
      `,
      errors: ["Сдесь можно использовать нативный `Array.map`"],
      output: `
        new Array().map(function() {})
      `,
    },

    {
      code: `
        const _ = require("lodash");
        const m = _.map([], fn);
      `,
      errors: ["Сдесь можно использовать нативный `Array.map`"],
      output: `
        const _ = require("lodash");
        const m = [].map(fn);
      `,
    },
  ],
});
