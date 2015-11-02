import Ember from 'ember';
import Validator from 'ember-validator/validators/validator';

export default Validator.extend({
  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (!this.options.pattern) {
      this.set('options.pattern', /^\d+(,\d{3})*(\.\d*)?$/);
    }

    if (!this.options.messages) {
      this.set('options.messages', {});
    }
  },

  CHECKS: {
    equalTo: '===',
    greaterThan: '>',
    greaterThanOrEqualTo: '>=',
    lessThan: '<',
    lessThanOrEqualTo: '<='
  },

  perform: function() {
    var value = this.model.get(this.property);
    var pattern = this.options.pattern;
    var str;
    var comparisonValue;
    var comparisonStr;
    var comparisonType;

    var isNumeric = function(str) {
      var val;
      if (pattern.test(str)) {
        val = Number(removeSpecial(str));
        return !isNaN(value) && isFinite(value);
      }
      return false;
    };

    var isInteger = function(value) {
      var val = Number(value);
      return toType(val)==='number' && val % 1 === 0;
    };

    var toStr = function(value) {
      return value + '';
    };

    var removeSpecial = function(str) {
      return str.replace(/[^\d.]/g, '');
    };

    if (!Ember.isEmpty(value)) {
      str = toStr(value);
      if (!isNumeric(str)) {
        this.errors.pushObject(this.options.messages.numeric);
      } else {
        str = removeSpecial(str);
        value = Number(str);
        if (this.options.integer && !isInteger(value)) {
          this.errors.pushObject(this.options.messages.integer);
        } else if (this.options.odd && parseInt(value, 10) % 2 === 0) {
          this.errors.pushObject(this.options.messages.odd);
        } else if (this.options.even && parseInt(value, 10) % 2 !== 0) {
          this.errors.pushObject(this.options.messages.even);
        } else if (this.options.decimal && str.length > this.options.decimal) {
          this.errors.pushObject(this.options.messages.decimal);
        } else if (this.options.fraction && str.length > this.options.fraction) {
          this.errors.pushObject(this.options.messages.fraction);
        } else {
          for (var key in this.CHECKS) {
            if (!this.options[key]) {
              continue;
            }

            comparisonStr = toStr(this.options[key]) || 0);
            comparisonValue = isNumeric(comparisonStr) ? Number(removeSpecial(comparisonStr)) : 0;
            comparisonType = this.CHECKS[key];

            if (!this.compare(value, comparisonValue, comparisonType)) {
              this.errors.pushObject(this.renderMessageFor(key, { count: comparisonValue }));
            }
          }
        }
      }
    }
  }
});
