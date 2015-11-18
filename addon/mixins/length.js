import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super();

    this.options.tokenizer = this.options.tokenizer || function(value) {
      return value.toString().split('');
    };
  },

  rules: {
    is: function(value, options) {
      return value === options.target;
    },

    minimum: function(value, options) {
      return value >= options.target;
    },

    maximum: function(value, options) {
      return value <= options.target;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      value = this.options.tokenizer(value).length;
      this.process(value);
    }
  }
});
