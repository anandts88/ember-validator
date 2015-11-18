import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super();

    if (typeof(this.options.required) === 'undefined' && typeof(this.options.notrequired) === 'undefined') {
      this.options.required = true;
    }
  },

  rules: {
    boolean: function(value) {
      return typeof(value) === 'boolean';
    },

    required: function(value) {
      return value;
    },

    notrequired: function(value) {
      return !value;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
