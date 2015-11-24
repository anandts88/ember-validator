import Ember from 'ember';
import Constants from 'ember-validator/constants';

const { Mixin, isEmpty } = Ember;

const {
  SSN_PATTERN1,
  SSN_PATTERN2,
  SSN_PATTERN3
} = Constants;

export default Mixin.create({
  FORMATS: [
    SSN_PATTERN1,
    SSN_PATTERN2,
    SSN_PATTERN3
  ],

  rules: {
    ssn(value) {
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

      if (Ember.isEmpty(pattern)) {
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
