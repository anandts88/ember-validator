import Ember from 'ember';

export default Ember.Mixin.create({

  rules: {
    notrequired: function(value) {
      return Ember.isEmpty(value);
    }
  },

  perform: function(value) {
    this.process(value);
  }
});
