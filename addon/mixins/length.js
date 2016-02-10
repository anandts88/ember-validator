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
    var option;

    if (!Ember.isEmpty(value)) {
      for (var key in this.CHECKS) {
        option = this.options[key];
        if (!_.isNumber(option)) {
          continue;
        }

        propertyLength = this.options.tokenizer(value).length; // Split value based on tokenizer, by default no of characters is counted as length
        comparisonLength = this.getValue(key); // Return comparison value from model or options
        comparisonType = this.CHECKS[key];

        if (!this.compare(propertyLength, comparisonLength, comparisonType)) {
          this.pushResult(this.options.messages[key], { count: comparisonLength });
        }
      }
    }
  }
});
