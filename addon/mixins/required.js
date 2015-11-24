import Ember from 'ember';

const { Mixin, isBlank } = Ember;

export default Mixin.create({
  rules: {
    required(value, options) {
      return !isBlank(value);
    }
  },

  perform(value) {
    this.process(value);
  }
});
