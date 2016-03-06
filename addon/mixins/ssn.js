import Ember from 'ember';
import Constants from 'ember-validator/constants';

const {
  Mixin,
  isNone,
  isEmpty
} = Ember;

export default Mixin.create({
  FORMATS: [
    Constants.SSN_PATTERN1,
    Constants.SSN_PATTERN2,
    Constants.SSN_PATTERN3
  ],

  ssn(value) {
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
      return this.message('ssn');
    }
  },

  perform() {
    let result;
    if (!isNone(value)) {

      result = this.ssn(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
