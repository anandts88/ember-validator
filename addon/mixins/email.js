import Ember from 'ember';
import Constants from 'ember-validator/constants';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({
  pattern: Constants.EMAIL_PATTERN,

  email(value) {
    let compare = this.options.with;
    let result;

    if (isNone(compare)) {
      with = this.get('pattern');
    }

    result = compare.test(value);

    if (!result) {
      return this.message('email');
    }
  },

  perform(value) {
    let result;

    if (!isNone(value)) {
      result = this.email(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
