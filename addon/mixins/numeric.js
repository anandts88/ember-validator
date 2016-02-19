import Ember from 'ember';
import Constants from 'ember-validator/constants';

const {
  Mixin,
  isNone,
  isArray
} = Ember;

export default Mixin.create({

  isNumeric(str, pattern) {
    let val;

    pattern = pattern || Constants.NUMERIC_PATTERN;
    if (pattern.test(str)) {
      val = Number(this.removeSpecial(str));
      return !isNaN(val) && isFinite(val);
    }
    return false;
  },

  isInteger(value) {
    let val = Number(value);
    return typeof(val) === 'number' && val % 1 === 0;
  },

  toStr(value) {
    return value + '';
  },

  removeSpecial(str) {
    return str.replace(/[^\d.]/g, '');
  },

  init() {
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

    if (this.options.range && isArray(this.options.range)) {
      first = this.options.range[0];
      last = this.options.range[1];

      first = this.toStr(first);
      first = this.isNumeric(first) ? Number(this.removeSpecial(first)) : 0;

      last = this.toStr(last);
      last = this.isNumeric(last) ? Number(this.removeSpecial(last)) : 0;

      this.options.range = {
        first: first,
        last: last
      };
    }

    if (this.options.between && isArray(this.options.between)) {
      first = this.options.range[0];
      last = this.options.range[1];

      first = this.toStr(first);
      first = this.isNumeric(first) ? Number(this.removeSpecial(first)) : 0;

      last = this.toStr(last);
      last = this.isNumeric(last) ? Number(this.removeSpecial(last)) : 0;

      this.options.between = {
        first: first,
        last: last
      };
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

  perform() {
    let value = this.model.get(this.property);
    let pattern = this.options.pattern;
    let str;
    let comparisonValue;
    let comparisonStr;
    let comparisonType;
    let dotIndex;
    let decimalVal;
    let option;

    if (!Ember.isEmpty(value)) {
      str = this.toStr(value);
      if (!this.isNumeric(str, pattern)) {
        this.pushResult(this.options.messages.numeric);
      } else {
        str = this.removeSpecial(str);
        value = Number(str);
        dotIndex  = str.indexOf('.');
        decimalVal = dotIndex !== -1 ? str.substring(0, dotIndex) : str;

        if (this.options.integer && !this.isInteger(value)) {
          this.pushResult(this.options.messages.integer);
        } else if (this.options.odd && parseInt(value, 10) % 2 === 0) {
          this.pushResult(this.options.messages.odd);
        } else if (this.options.even && parseInt(value, 10) % 2 !== 0) {
          this.pushResult(this.options.messages.even);
        } else if (this.options.decimal && decimalVal.length > this.options.decimal) {
          this.pushResult(this.options.messages.decimal);
        } else if (this.options.fraction && dotIndex !== -1 && str.substring(dotIndex).length > this.options.fraction) {
          this.pushResult(this.options.messages.fraction);
        } else if (this.options.range && value < this.options.range.first && value > this.options.range.last) {
          this.pushResult(this.options.messages.range, {
            first: this.options.range.first,
            last: this.options.range.last
          });
        } else if (this.options.between && value <= this.options.between.first && value >= this.options.between.last) {
          this.pushResult(this.options.messages.between, {
            first: this.options.between.first,
            last: this.options.between.last
          });
        } else {
          for (let key in this.CHECKS) {
            option = this.options[key];
            if (isNone(option)) {
              continue;
            }

            comparisonStr = this.toStr(this.options[key]);
            comparisonValue = this.isNumeric(comparisonStr, pattern) ? Number(this.removeSpecial(comparisonStr)) : 0;
            comparisonType = this.CHECKS[key];

            if (!this.compare(value, comparisonValue, comparisonType)) {
              this.pushResult(this.options.messages[key], { count: comparisonValue });
            }
          }
        }
      }
    }
  }
});
