import Ember from 'ember';

export default Ember.Mixin.create({
  rules: {
    required: function(value, options) {
      return !Ember.isBlank(value);
    }
  },

  perform: function(value) {
    this.process(value);
  }
});
