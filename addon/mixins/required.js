import Ember from 'ember';

const {
  Mixin,
  isBlank
} = Ember;

export default Mixin.create({
  required(value) {
    let result = !isBlank(value);

    if (!result) {
      return this.message('required');
    }
  },

  perform(value) {
    return this.required(value);
  }
});
