import moment from 'moment';
import Constants from 'ember-validator/constants';

export function isArray(arr) {
  return arr.constructor.toString().indexOf("Array") > -1;
}

export function toMoment(value, format) {
  var date;
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
  var val = Number(value);
  return typeof(val) === 'number' && val % 1 === 0;
}

export function toStr(value) {
  return value + '';
}

export function removeSpecial(str) {
  return str.replace(/[^\d.]/g, '');
}

export function toNumber(value, pattern) {
  var str = toStr(value);
  var val;

  pattern = pattern || Constants.NUMERIC_PATTERN;
  if (pattern.test(str)) {
    val = Number(removeSpecial(str));
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
