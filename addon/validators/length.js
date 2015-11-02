import Ember from 'ember';
import Validator from 'ember-validator/validators/validator';
import Messages from 'ember-validator/messages';

export default Validator.extend({
  init: function() {
    this._super();
    if (typeof(this.options) === 'number') {
      this.set('options', { 'is': this.options });
    }

    if (!this.options.messages) {
      this.set( 'options.messages', {});
    }

    this.options.tokenizer = this.options.tokenizer || function(value) {
      return value.toString().split('');
    };
  },

  CHECKS: {
    'is': '===',
    'minimum': '>=',
    'maximum': '<='
  },

  getValue: function(key) {
    if (this.options[key].constructor === String) {
      return this.model.get(this.options[key]) || 0;
    } else {
      return this.options[key];
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var propertyLength;
    var comparisonLength;
    var comparisonType;

    if (!Ember.isEmpty(value)) {
      for (var key in this.CHECKS) {
        if (!this.options[key]) {
          continue;
        }

        propertyLength = this.options.tokenizer(value).length; // Split value based on tokenizer, by default no of characters is counted as length
        comparisonLength = this.getValue(key); // Return comparison value from model or options
        comparisonType = this.CHECKS[key];

        if (!this.compare(propertyLength, comparisonLength, comparisonType)) {
          this.pushResult(this.renderMessageFor(key, { count: comparisonLength }), key);
        }
      }
    }
  }
});
