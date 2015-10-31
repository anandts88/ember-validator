import Ember from 'ember';
import Base from 'ember-validations/validators/validator';
import Messages from 'ember-validations/messages';

export default Base.extend({

  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (this.options.messages === undefined) {
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

  getValue: function(key) {
    if (this.options[key].constructor === String) {
      return get(this.model, this.options[key]) || 0;
    } else {
      return this.options[key];
    }
  },

  renderMessageFor: function(key, value) {
    var options = { count: value };
    for (var _key in this.options) {
      options[_key] = this.options[_key];
    }

    return this.options.messages[key] || Messages.render(key, options);
  },

  perform: function() {
    var value = this.model.get(this.property);
    var comparisonValue;
    var comparisonType;

    var isNumeric = function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    };

    var isInteger = function(value) {
      var val = parseFloat(value);
      return toType(val)==='number' && val % 1 === 0;
    };

    if (!Ember.isEmpty(value)) {
      if (!isNumeric(value)) {
        this.errors.pushObject(this.options.messages.numeric);
      } else if (this.options.integer && !isInteger(value)) {
        this.errors.pushObject(this.options.messages.integer);
      } else if (this.options.odd && parseInt(value, 10) % 2 === 0) {
        this.errors.pushObject(this.options.messages.odd);
      } else if (this.options.even && parseInt(value, 10) % 2 !== 0) {
        this.errors.pushObject(this.options.messages.even);
      } else {
        value = parseFloat(value);
        for (var key in this.CHECKS) {
          if (!this.options[key]) {
            continue;
          }

          comparisonValue = this.getValue(key);
          comparisonType = this.CHECKS[key];

          if (!this.compare(value, comparisonValue, comparisonType)) {
            this.errors.pushObject(this.renderMessageFor(key, comparisonValue));
          }
        }
      }
    }
  }
});
