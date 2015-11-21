import Ember from 'ember';
import Constants from 'ember-validator/constants';
import Utils from 'ember-validator/utils';

export default Ember.Mixin.create({

  init: function() {
    this._super();

    if (!this.options.pattern) {
      this.set('options.pattern', Constants.NUMERIC_PATTERN);
    }

    if (!this.options.decimal) {
      this.set('options.decimal', 12);
    }

    if (!this.options.fractions) {
      this.set('options.fractions', 2);
    }
  },

  rules: {
    numeric: function(value) {
      return Utils.isNumeric(value);
    },

    integer: function(value) {
      return Utils.isInteger(value);
    },

    odd: function(value) {
      return parseInt(value, 10) % 2 !== 0;
    },

    even: function(value) {
      return parseInt(value, 10) % 2 === 0;
    },

    decimal: function(value, options) {
      var dotIndex;
      var decimalVal;
      var str;

      str = Utils.toStr(value);
      dotIndex  = str.indexOf('.');
      decimalVal = dotIndex !== -1 ? str.substring(0, dotIndex) : str;

      return decimalVal.length <= (options.target || 12);
    },

    fraction: function(value, options) {
      var dotIndex;
      var str;

      str = Utils.toStr(value);
      dotIndex  = str.indexOf('.');

      return (dotIndex === -1) || (dotIndex !== -1 && str.substring(dotIndex).length <= (options.target || 2));
    },

    range: function(value, options) {
      var first;
      var last;
      var range;

      if (Utils.isArray(options.target)) {
        first = options.value[0];
        last = options.value[1];

        first = Utils.toNumber(first);
        first = Utils.isNumeric(first) ? first : 0;

        last = Utils.toNumber(last);
        last = Utils.isNumeric(last) ? last : 0;

        range = {
          first: first,
          last: last
        };
      } else {
        range = options.target;
      }

      return value >= range.first && value <= range.last;
    },

    between: function(value, options) {
      var first;
      var last;
      var range;

      if (Utils.isArray(options.target)) {
        first = options.value[0];
        last = options.value[1];

        first = Utils.toNumber(first);
        first = Utils.isNumeric(first) ? first : 0;

        last = Utils.toNumber(last);
        last = Utils.isNumeric(last) ? last : 0;

        range = {
          first: first,
          last: last
        };
      } else {
        range = options.target;
      }

      return value > range.first && value < range.last;
    },

    notEqualTo: function(value, options) {
      var comparisonValue;

      comparisonValue = Utils.toNumber(options.target);
      comparisonValue = Utils.isNumeric(comparisonValue) ? comparisonValue : 0;

      return value !== comparisonValue;
    },

    equalTo: function(value, options) {
      var comparisonValue;

      comparisonValue = Utils.toNumber(options.target);
      comparisonValue = Utils.isNumeric(comparisonValue) ? comparisonValue : 0;

      return value === comparisonValue;
    },

    greaterThan: function(value, options) {
      var comparisonValue;

      comparisonValue = Utils.toNumber(options.target);
      comparisonValue = Utils.isNumeric(comparisonValue) ? comparisonValue : 0;

      return value > comparisonValue;
    },

    greaterThanOrEqualTo: function(value, options) {
      var comparisonValue;

      comparisonValue = Utils.toNumber(options.target);
      comparisonValue = Utils.isNumeric(comparisonValue) ? comparisonValue : 0;

      return value >= comparisonValue;
    },

    lessThan: function(value, options) {
      var comparisonValue;

      comparisonValue = Utils.toNumber(options.target);
      comparisonValue = Utils.isNumeric(comparisonValue) ? comparisonValue : 0;

      return value < comparisonValue;
    },

    lessThanOrEqualTo: function(value, options) {
      var comparisonValue;

      comparisonValue = Utils.toNumber(options.target);
      comparisonValue = Utils.isNumeric(comparisonValue) ? comparisonValue : 0;

      return value <= comparisonValue;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(Utils.toNumber(value));
    }
  }
});
