import Ember from 'ember';
import { isString, isRegexp } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({

  rules: {
    hasAlphabet(value) {
      return /(?=.*[a-z]|[A-Z])/.test(value);
    },

    hasUpperCase(value) {
      return /(?=.*[A-Z])/.test(value);
    },

    hasLowerCase(value) {
      return /(?=.*[a-z])/.test(value);
    },

    hasNumber(value) {
      return /(?=.*\d)/.test(value);
    },

    hasSpecial(value, options) {
      let specialTest;

      if (isString(options.target)) {
        specialTest = new RegExp('(?=.*[' + options + '])').test(value);
      } else if (isRegexp(options.target)) {
        specialTest = options.target.test(value);
      } else {
        specialTest = new RegExp('(?=.*[!@$%^&*()-+_=~`{}:;"\'<>,.|?])').test(value);
      }

      return specialTest;
    },

    hasNoSpecial(value) {
      return /^[a-zA-Z0-9]+$/.test(value);
    },

    hasNoSpace(value) {
      return !/[\s]/.test(value);
    },

    with(value, options) {
      return options.target.test(value);
    },

    without(value, options) {
      return !options.target.test(value);
    },

    array(value, options) {
      let valid = [];
      let arr;

      for (let count = 0 ; count < options.target.length ; count++) {
        valid.push(true);
        arr = options.target[count];
        if (arr.with && !arr.with.test(value)) {
          valid[count] = false;
          break;
        } else if (arr.without && arr.without.test(value)) {
          valid[count] = false;
          break;
        }
      }

      return valid;
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(value);
    }
  }
});
