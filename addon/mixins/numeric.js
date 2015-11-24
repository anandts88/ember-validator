import Ember from 'ember';
import Constants from 'ember-validator/constants';
import { isNumeric, isInteger, toStr, isArray, toNumber } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({

  init() {
    this._super();

    if (!this.options.pattern) {
      this.set('options.pattern', Constants.NUMERIC_PATTERN);
    }

    if (!this.options.decimal) {
      this.set('options.decimal', 12);
    }

    if (!this.options.fraction) {
      this.set('options.fraction', 2);
    }
  },

  rules: {
    numeric(value) {
      return isNumeric(value);
    },

    integer(value) {
      return isInteger(value);
    },

    odd(value) {
      return parseInt(value, 10) % 2 !== 0;
    },

    even(value) {
      return parseInt(value, 10) % 2 === 0;
    },

    decimal(value, options) {
      let dotIndex;
      let decimalVal;
      let str;

      str = toStr(value);
      dotIndex  = str.indexOf('.');
      decimalVal = dotIndex !== -1 ? str.substring(0, dotIndex) : str;

      return decimalVal.length <= (options.target || 12);
    },

    fraction(value, options) {
      let dotIndex;
      let str;

      str = toStr(value);
      dotIndex  = str.indexOf('.');

      return (dotIndex === -1) || (dotIndex !== -1 && str.substring(dotIndex).length <= (options.target || 2));
    },

    range(value, options) {
      let first;
      let last;
      let range;

      if (isArray(options.target)) {
        first = options.target[0];
        last = options.target[1];

        first = toNumber(first);
        first = isNumeric(first) ? first : 0;

        last = toNumber(last);
        last = isNumeric(last) ? last : 0;

        range = {
          first: first,
          last: last
        };
      } else {
        range = options.target;
      }

      return value >= range.first && value <= range.last;
    },

    between(value, options) {
      let first;
      let last;
      let range;

      if (isArray(options.target)) {
        first = options.target[0];
        last = options.target[1];

        first = toNumber(first);
        first = isNumeric(first) ? first : 0;

        last = toNumber(last);
        last = isNumeric(last) ? last : 0;

        range = {
          first: first,
          last: last
        };
      } else {
        range = options.target;
      }

      return value > range.first && value < range.last;
    },

    notEqualTo(value, options) {
      let comparisonValue;

      comparisonValue = toNumber(options.target);
      comparisonValue = isNumeric(comparisonValue) ? comparisonValue : 0;

      return value !== comparisonValue;
    },

    equalTo(value, options) {
      let comparisonValue;

      comparisonValue = toNumber(options.target);
      comparisonValue = isNumeric(comparisonValue) ? comparisonValue : 0;

      return value === comparisonValue;
    },

    greaterThan(value, options) {
      let comparisonValue;

      comparisonValue = toNumber(options.target);
      comparisonValue = isNumeric(comparisonValue) ? comparisonValue : 0;

      return value > comparisonValue;
    },

    greaterThanOrEqualTo(value, options) {
      let comparisonValue;

      comparisonValue = toNumber(options.target);
      comparisonValue = isNumeric(comparisonValue) ? comparisonValue : 0;

      return value >= comparisonValue;
    },

    lessThan(value, options) {
      let comparisonValue;

      comparisonValue = toNumber(options.target);
      comparisonValue = isNumeric(comparisonValue) ? comparisonValue : 0;

      return value < comparisonValue;
    },

    lessThanOrEqualTo(value, options) {
      let comparisonValue;

      comparisonValue = toNumber(options.target);
      comparisonValue = isNumeric(comparisonValue) ? comparisonValue : 0;

      return value <= comparisonValue;
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(toNumber(value));
    }
  }
});
