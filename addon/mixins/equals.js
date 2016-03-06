import Ember from 'ember';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({
  accept(value) {
    let { accept, ignoreCase } = this.options;
    let result;

    if (isNone(accept)) {
      return;
    }

    if (ignoreCase && typeof(value) === 'string') {
      value = `${value}`.toLowerCase();
      accept = `${accept}`.toLowerCase();
    }

    result = (value === accept);

    if (!result) {
      return this.message('accept');
    }
  },

  reject(value) {
    let { reject, ignoreCase } = this.options;
    let result;

    if (isNone(reject)) {
      return;
    }

    if (ignoreCase && typeof(value) === 'string') {
      value = `${value}`.toLowerCase();
      reject = `${reject}`.toLowerCase();
    }

    result = (value !== reject);

    if (!result) {
      return this.message('reject');
    }
  },

  perform(value) {
    let result;
    if (!isNone(value)) {

      result = this.accept(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.reject(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
