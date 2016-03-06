import Ember from 'ember';

const {
  Mixin,
  isNone,
  isEmpty
} = Ember;

export default Mixin.create({
  hasSpecial(value) {
    let { hasSpecial } = this.options;
    let result;

    if (isNone(hasSpecial) || hasSpecial === false) {
      return;
    }

    if (typeof(hasSpecial) === 'string') {
      result = new RegExp(`(?=.*[${hasSpecial}])`).test(value);
    } else if (hasSpecial.constructor !== RegExp) {
      result = hasSpecial.test(value);
    } else {
      result = new RegExp('(?=.*[!@$%^&*()-+_=~`{}:;"\'<>,.|?])').test(value);
    }

    if (!result) {
      return this.message('hasSpecial');
    }
  },

  hasAlphabet(value) {
    let { hasAlphabet } = this.options;
    let result;

    if (isNone(hasAlphabet) || hasAlphabet === false) {
      return;
    }

    result = /(?=.*[a-z]|[A-Z])/.test(value);

    if (!result) {
      return this.message('hasAlphabet');
    }
  },

  hasUpperCase(value) {
    let { hasUpperCase } = this.options;
    let result;

    if (isNone(hasUpperCase) || hasUpperCase === false) {
      return;
    }

    result = /(?=.*[A-Z])/.test(value);

    if (!result) {
      return this.message('hasUpperCase');
    }
  },

  hasLowerCase(value) {
    let { hasLowerCase } = this.options;
    let result;

    if (isNone(hasLowerCase) || hasLowerCase === false) {
      return;
    }

    result = /(?=.*[a-z])/.test(value);

    if (!result) {
      return this.message('hasLowerCase');
    }
  },

  hasNumber(value) {
    let { hasNumber } = this.options;
    let result;

    if (isNone(hasNumber) || hasNumber === false) {
      return;
    }

    result = /(?=.*\d)/.test(value);

    if (!result) {
      return this.message('hasNumber');
    }
  },

  hasNoSpecial(value) {
    let { hasNoSpecial } = this.options;
    let result;

    if (isNone(hasNoSpecial) || hasNoSpecial === false) {
      return;
    }

    result = /^[a-zA-Z0-9]+$/.test(value);

    if (!result) {
      return this.message('hasNoSpecial');
    }
  },

  hasNoSpace(value) {
    let { hasNoSpace } = this.options;
    let result;

    if (isNone(hasNoSpace) || hasNoSpace === false) {
      return;
    }

    result = !/[\s]/.test(value);

    if (!result) {
      return this.message('hasNoSpace');
    }
  },

  with(value) {
    let compare = this.options.with;
    let result;

    if (isNone(compare)) {
      return;
    }

    result = compare.test(value);

    if (!result) {
      return this.message('with');
    }
  },

  without(value) {
    let { without } = this.options;
    let result;

    if (isNone(without)) {
      return;
    }

    result = !without.test(value);

    if (!result) {
      return this.message('with');
    }
  },

  array(value) {
    let { array } = this.options;
    let arr;
    let message;
    let result;

    if (isNone(array) || isEmpty(array)) {
      return;
    }

    for (let count = 0 ; count < array.length ; count++) {
      result  = undefined;
      message = undefined;
      arr     = array[count];

      if (typeof(arr) === 'object') {
        if (!isNone(arr.with) && arr.with.constructor === RegExp) {
          result = arr.with.test(value);

          if (!result) {
            message = arr.message || this.message('array', {
              messageIndex: count
            });
            break;
          }
        }

        if (!isNone(arr.without) && arr.without.constructor === RegExp) {
          result = !arr.without.test(value);

          if (!result) {
            message = arr.message || this.message('array', {
              messageIndex: count
            });
            break;
          }
        }
      } else {
        break;
      }
    }

    return message;
  },

  perform(value) {
    let result;

    if (!isNone(value)) {
      result = this.hasSpecial(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.hasAlphabet(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.hasUpperCase(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.hasLowerCase(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.hasNumber(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.hasNoSpecial(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.hasNoSpace(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.with(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.without(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.array(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
