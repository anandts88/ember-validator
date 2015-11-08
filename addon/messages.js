import Ember from 'ember';

export default {
  boolean: {
    boolean: 'must be boolean',
    required: 'must be true',
    no: 'must be false'
  },

  contains: {
    include: 'must be one of the list values',
    exclude: 'must not be one of the list values',
    includeRange: 'must be one of the list values',
    exludeRange: 'must not be one of the list values'
  },

  date: {
    date: 'valid date',
    weekend: 'must not be weekend',
    onlyWeekend: 'must be weekend',
    same: 'must be same as {{target}}',
    before: 'must be before {{target}}',
    after: 'must be after {{target}}',
    beforeSame: 'must be before or same as {{target}}',
    afterSame: 'must be after or same as {{target}}'
  },

  length: {
    maximum: 'must be maximum of {{count}} characters',
    minimum: 'must be minimum of {{count}} characters',
    is: 'must be {{count}} characters'
  },

  numeric: {
    numeric: 'must be a number',
    integer: 'must be an integer',
    greaterThan: 'must be greater than {{count}}',
    greaterThanOrEqualTo: 'must be greater than or equal to {{count}}',
    equalTo: 'must be equal to {{count}}',
    notEqualTo: 'must not be equal to {{count}}',
    lessThan: 'must be less than {{count}}',
    lessThanOrEqualTo: 'must be less than or equal to {{count}}',
    odd: 'must be odd',
    even: 'must be even',
    decimal: 'decimal part must be {{count}} digits',
    fraction: 'fraction part must be {{fraction}} digits',
    range: 'must be in range {{first}} and {{last}}',
    between: 'must between {{first}} and {{last}}'
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

  phone: 'valid phone number',
  required: 'must not be empty',
  notrequired: 'must be empty',
  ssn: 'valid ssn',
  zip: 'valid zip',
  email: 'valid email',
  equals: 'must be equal'
};
