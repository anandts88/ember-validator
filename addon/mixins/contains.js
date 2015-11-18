import Ember from 'ember';
import Utils from 'ember-validator/utils';

export default Ember.Mixin.create({

  rules: {
    exclude: function(value, options) {
      return options.target.indexOf(value) === -1;
    },

    include: function(value, options) {
      return options.target.indexOf(value) !== -1;
    },

    exludeRange: function(value, options) {
      var first = options.target.exludeRange[0];
      var last = options.target.exludeRange[1];

      return value < first && value > last;
    },

    includeRange: function(value, options) {
      var first = options.target.includeRange[0];
      var last = options.target.includeRange[1];

      return value >= first && value <= last;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
