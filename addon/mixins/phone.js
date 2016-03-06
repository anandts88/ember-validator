import Ember from 'ember';
import Constants from 'ember-validator/constants';

const {
  Mixin,
  isNone,
  isEmpty
} = Ember;

export default Mixin.create({
  FORMATS: [
    Constants.PHONE_PATTERN1, // (999) 999 9999
    Constants.PHONE_PATTERN2, // (999) 999-9999
    Constants.PHONE_PATTERN3, // (999)999 9999
    Constants.PHONE_PATTERN4, // (999)999-9999
    Constants.PHONE_PATTERN5, // (999)9999999
    Constants.PHONE_PATTERN6, // 999 999 9999
    Constants.PHONE_PATTERN7, // 999-999-9999
    Constants.PHONE_PATTERN8, // 999.999.9999
    Constants.PHONE_PATTERN9 // 9999999999
  ],

  phone(value) {
    let result  = false;
    let pattern = Ember.A();
    let compare = this.options.with;
    let { all } = this.options;
    let format;
    let index;

    for (let count = 1; count <= this.FORMATS.length; count++) {
      index = count - 1;
      format = this.options[`format${count}`];
      if (format || all) {
        pattern.pushObject(this.FORMATS[index]);
      }
    }

    if (compare) {
      pattern.pushObject(compare);
    }

    if (isEmpty(pattern)) {
      pattern.pushObject(this.FORMATS[0]);
    }

    pattern.forEach((arr) => {
      if (arr.test(value)) {
        result = true;
      }
    });

    if (!result) {
      return this.message('phone');
    }
  },

  perform(value) {
    let result;
    if (!isNone(value)) {

      result = this.phone(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
