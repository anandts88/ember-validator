import Ember from 'ember';
import Base from 'ember-validations/validators/validator';
import Messages from 'ember-validations/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    if (typeof(this.options) === 'number') {
      set(this, 'options', { 'is': this.options });
    }

    if (this.options.messages === undefined) {
      set(this, 'options.messages', {});
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
    var key, comparisonResult;
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
          this.errors.pushObject(this.renderMessageFor(key, comparisonLength));
        }
      }
    }
  }
});
