import Ember from 'ember';

export default {
  boolean: {
    boolean: 'must be boolean',
    required: 'must be true',
    notrequired: 'must be false'
  },

  contains: {
    include: 'must be one of the list values',
    exclude: 'must not be one of the list values',
    includeRange: 'must be one of the list values',
    excludeRange: 'must not be one of the list values'
  },

  date: {
    date: 'valid date',
    weekend: 'must be weekend',
    notWeekend: 'must not be weekend',
    same: 'must be same as {{target}}',
    before: 'must be before {{target}}',
    after: 'must be after {{target}}',
    beforeSame: 'must be before or same as {{target}}',
    afterSame: 'must be after or same as {{target}}'
  },

  length: {
    maximum: 'must be maximum of {{target}} characters',
    minimum: 'must be minimum of {{target}} characters',
    is: 'must be {{target}} characters'
  },

  numeric: {
    numeric: 'must be a number',
    integer: 'must be an integer',
    greaterThan: 'must be greater than {{target}}',
    greaterThanOrEqualTo: 'must be greater than or equal to {{target}}',
    equalTo: 'must be equal to {{target}}',
    notEqualTo: 'must not be equal to {{target}}',
    lessThan: 'must be less than {{target}}',
    lessThanOrEqualTo: 'must be less than or equal to {{target}}',
    odd: 'must be odd',
    even: 'must be even',
    decimal: 'decimal part must be {{target}} digits',
    fraction: 'fraction part must be {{target}} digits',
    range: 'must be in range {{target}}',
    between: 'must between {{target}}'
  },

  pattern: {
    with: 'must match',
    without: 'must not match',
    array: 'must match pattern',
    hasAlphabet: 'must contain one alphabet',
    hasUpperCase: 'must contain one upper case alphabet',
    hasLowerCase: 'must contain one lower case alphabet',
    hasNoSpace: 'must not contain space',
    hasNumber: 'must contain one number',
    hasSpecial: 'must contain one special character',
    hasNoSpecial: 'must not contain any special character'
  },

  phone: {
    phone: 'valid phone number'
  },

  required: {
    required: 'must not be empty'
  },

  notrequired: {
    notrequired: 'must be empty'
  },

  ssn: {
    ssn: 'valid ssn'
  },

  zip: {
    zip: 'valid zip'
  },

  email: {
    email: 'valid email'
  },

  equals: {
    accept: 'must be equal',
    reject: 'must not be equal'
  }
};
