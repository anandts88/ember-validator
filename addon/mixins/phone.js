import Ember from 'ember';
import Constants from 'ember-validator/constants';

const { Mixin, isEmpty } = Ember;

const {
  PHONE_PATTERN1,
  PHONE_PATTERN2,
  PHONE_PATTERN3,
  PHONE_PATTERN4,
  PHONE_PATTERN5,
  PHONE_PATTERN6,
  PHONE_PATTERN7,
  PHONE_PATTERN8,
  PHONE_PATTERN9
} = Constants;

export default Mixin.create({
  FORMATS: [
    PHONE_PATTERN1, // (999) 999 9999
    PHONE_PATTERN2, // (999) 999-9999
    PHONE_PATTERN3, // (999)999 9999
    PHONE_PATTERN4, // (999)999-9999
    PHONE_PATTERN5, // (999)9999999
    PHONE_PATTERN6, // 999 999 9999
    PHONE_PATTERN7, // 999-999-9999
    PHONE_PATTERN8, // 999.999.9999
    PHONE_PATTERN9 // 9999999999
  ],

  rules: {
    phone(value) {
      let test  = false;
      let pattern = Ember.A();
      let format;
      let index;

      for (let count = 1; count <= this.FORMATS.length; count++) {
        index = count - 1;
        format = this.options['format' + count];
        if (format || this.options.all) {
          pattern.pushObject(this.FORMATS[index]);
        }
      }

      if (this.options.with) {
        pattern.pushObject(this.options.with);
      }

      if (isEmpty(pattern)) {
        pattern.pushObject(this.FORMATS[0]);
      }

      pattern.forEach((arr) => {
        if (arr.test(value)) {
          test = true;
        }
      });

      return test;
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(value);
    }
  }
});
