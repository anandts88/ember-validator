import Ember from 'ember';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({

  rules: {
    notrequired(value) {
      return isEmpty(value);
    }
  },

  perform(value) {
    this.process(value);
  }
});
