import Ember from 'ember';

const {
  isArray
} = Ember;

const objectProto       = Object.prototype;
const funcProto         = Function.prototype;

const objectToString    = objectProto.toString;
const funcToString      = funcProto.toString;

const objectCtorString  = funcToString.call(Object);

const objectTag         = '[object Object]';
const getPrototypeOf    = Object.getPrototypeOf;

export function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

export function isObjectLike(value) {
  return !!value && typeof value === 'object';
}

export function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  let result = false;
  if (value !== null && typeof value.toString !== 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

export function isPlainObject(value) {
  let proto;
  let Ctor;

  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }

  proto = getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  Ctor = proto.constructor;
  return (typeof Ctor === 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString);
}
