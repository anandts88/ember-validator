import Ember from 'ember';
import Constants from 'ember-validator/constants';

const {
  Mixin
} = Ember;

export default Mixin.create({
  FORMATS: [
    Constants.SSN_PATTERN1,
    Constants.SSN_PATTERN2,
    Constants.SSN_PATTERN3
  ],

  perform() {
    let value = this.model.get(this.property);
    let test  = false;
    let pattern = Ember.A();
    let format;
    let index;

    if (!Ember.isEmpty(value)) {
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

      pattern.forEach(function(arr) {
        if (arr.test(value)) {
          test = true;
        }
      });

      if (!test) {
        this.pushResult(this.options.message);
      }
    }
  }
});
