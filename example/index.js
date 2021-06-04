/* eslint-disable prefer-const */
/* eslint-disable no-new-object */
/* eslint-disable no-unused-vars */

let _ = require("lodash");

const func = (val, index) => {
  // noop
};

// Можно закомментить некст строку
// _ = { map: func };

const testArr = [1, 2, 3];
const testObj = {};
const testNewArr = new Array(5);
const testNewObj = new Object();

// на Массив
_.map([], func);
_.map(testArr, func);
_.map(testNewArr, func);

// на Объект
_.map({}, func);
_.map(testObj, func);
_.map(testNewObj, func);
