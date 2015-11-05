import Ember from 'ember';
import Constants from 'ember-validator/constants';

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

  CHECKS: {
    notEqualTo: '!==',
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
    var dotIndex;
    var decimalVal;

    var isNumeric = function(str) {
      var val;
      if (pattern.test(str)) {
        val = Number(removeSpecial(str));
        return !isNaN(val) && isFinite(val);
      }
      return false;
    };

    var isInteger = function(value) {
      var val = Number(value);
      return typeof(val) === 'number' && val % 1 === 0;
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
        this.pushResult(this.options.messages.numeric);
      } else {
        str = removeSpecial(str);
        value = Number(str);
        dotIndex  = str.indexOf('.');
        decimalVal = dotIndex !== -1 ? str.substring(0, dotIndex) : str;

        if (this.options.integer && !isInteger(value)) {
          this.pushResult(this.options.messages.integer, 'integer');
        } else if (this.options.odd && parseInt(value, 10) % 2 === 0) {
          this.pushResult(this.options.messages.odd, 'odd');
        } else if (this.options.even && parseInt(value, 10) % 2 !== 0) {
          this.pushResult(this.options.messages.even, 'even');
        } else if (this.options.decimal && decimalVal.length > this.options.decimal) {
          this.pushResult(this.options.messages.decimal, 'decimal');
        } else if (this.options.fraction && dotIndex !== -1 && str.substring(dotIndex).length > this.options.fraction) {
          this.pushResult(this.options.messages.fraction, 'fraction');
        } else {
          for (var key in this.CHECKS) {
            if (!this.options[key]) {
              continue;
            }

            comparisonStr = toStr(this.options[key]);
            comparisonValue = isNumeric(comparisonStr) ? Number(removeSpecial(comparisonStr)) : 0;
            comparisonType = this.CHECKS[key];

            if (!this.compare(value, comparisonValue, comparisonType)) {
              this.pushResult(this.renderMessageFor(key, {
                count: comparisonValue
              }), key);
            }
          }
        }
      }
    }
  }
});
