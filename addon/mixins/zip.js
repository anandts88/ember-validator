import Ember from 'ember';
import Constants from 'ember-validator/constants';

export default Ember.Mixin.create({

  rules: {
    zip: function(value) {
      var pattern = Constants.ZIP_PATTERN;

      if (this.options.constructor === RegExp ||
        (this.options.with && this.options.with.constructor === RegExp)) {
        pattern = options;
      }

      return pattern.test(value);
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
