import Ember from 'ember';
import Constants from 'ember-validator/constants';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({
  pattern: Constants.ZIP_PATTERN,

  zip(value) {
    let compare = this.options.with;
    let result;

    if (isNone(compare)) {
      with = this.get('pattern');
    }

    result = compare.test(value);

    if (!result) {
      return this.message('zip');
    }
  },

  perform(value) {
    let result;

    if (!isNone(value)) {
      result = this.zip(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
