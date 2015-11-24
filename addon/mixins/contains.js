import Ember from 'ember';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({

  rules: {
    exclude(value, options) {
      return options.target.indexOf(value) === -1;
    },

    include(value, options) {
      return options.target.indexOf(value) !== -1;
    },

    excludeRange(value, options) {
      var first = options.target[0];
      var last = options.target[1];

      return value < first && value > last;
    },

    includeRange(value, options) {
      var first = options.target[0];
      var last = options.target[1];

      return value >= first && value <= last;
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(value);
    }
  }
});
