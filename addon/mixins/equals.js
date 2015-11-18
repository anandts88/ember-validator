import Ember from 'ember';

export default Ember.Mixin.create({
  rules: {
    accept: function(value, options) {
      return value === options.target;
    },

    reject: function(value, options) {
      return value !== options.target;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
