import moment from 'moment';
import Constants from 'ember-validator/constants';

const { NUMERIC_PATTERN } = Constants;

export function isArray(arr) {
  return arr.constructor.toString().indexOf("Array") > -1;
}

export function isString(str) {
  return typeof(str) === 'string';
}

export function isRegexp(regexp) {
  return regexp.constructor === RegExp;
}

export function isUndefined(value) {
  return typeof(value) === 'undefined';
}

export function toMoment(value, format) {
  let date;
  if (typeof(value) === 'string' && format) {
    date = moment(value, format, true);
  } else {
    date = moment(value);
  }
  return date;
}

export function setTime(date, hours, minutes, seconds, milliseconds) {
  date.hours(hours);
  date.minutes(minutes);
  date.seconds(seconds);
  date.milliseconds(milliseconds);
  return date;
}

export function isNumeric(value, pattern) {
  return "Invalid" !== value
}

export function isInteger(value) {
  let val = Number(value);
  return typeof(val) === 'number' && val % 1 === 0;
}

export function toStr(value) {
  return value + '';
}

export function removeComma(str) {
  return str.replace(/,/g, '')
}

export function toNumber(value, pattern) {
  const str = toStr(value);
  let val;

  pattern = pattern || NUMERIC_PATTERN;
  if (pattern.test(str)) {
    val = Number(removeComma(str));
    if (!isNaN(val) && isFinite(val)) {
      return val;
    } else {
      return "Invalid";
    }
  }
  return "Invalid";
}

export function isPlainObject(obj) {
  // Basic check for Type object that's not null
  if (typeof obj == 'object' && obj !== null) {

    // If Object.getPrototypeOf supported, use it
    if (typeof Object.getPrototypeOf == 'function') {
      var proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || proto === null;
    }

    // Otherwise, use internal class
    // This should be reliable as if getPrototypeOf not supported, is pre-ES5
    return Object.prototype.toString.call(obj) == '[object Object]';
  }

  // Not an object
  return false;
}
