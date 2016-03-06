import Ember from 'ember';

const {
  Mixin,
  isEmpty
} = Ember;

export default Mixin.create({
  notrequired(value) {
    let result = isEmpty(value);

    if (!result) {
      return this.message('notrequired');
    }
  },

  perform(value) {
    return this.notrequired(value);
  }
});
