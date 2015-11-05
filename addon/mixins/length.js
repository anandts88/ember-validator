import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super();

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
