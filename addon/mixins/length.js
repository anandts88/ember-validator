import Ember from 'ember';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({
  init() {
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

  getValue(key) {
    if (this.options[key].constructor === String) {
      return this.model.get(this.options[key]) || 0;
    } else {
      return this.options[key];
    }
  },

  perform() {
    let value = this.model.get(this.property);
    let propertyLength;
    let comparisonLength;
    let comparisonType;
    let option;

    if (!Ember.isEmpty(value)) {
      for (let key in this.CHECKS) {
        option = this.options[key];
        if (isNone(option)) {
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
