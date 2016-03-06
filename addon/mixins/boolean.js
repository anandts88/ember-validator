import Ember from 'ember';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({
  boolean(value) {
    let result = typeof(value) === 'boolean';

    if (!result) {
      return this.message('boolean');
    }
  },

  required(value) {
    let { required } = this.options;
    let result;

    if (isNone(required)) {
      return;
    }

    result = value === true;

    if (!result) {
      return this.message('required');
    }
  },

  notrequired(value) {
    let { notrequired } = this.options;
    let result;

    if (isNone(notrequired)) {
      return;
    }

    result = value === false;

    if (!result) {
      return this.message('notrequired');
    }
  },

  perform(value) {
    let result;

    result = this.boolean(value);
    if (!isNone(result)) {
      return result;
    }

    result = this.required(value);
    if (!isNone(result)) {
      return result;
    }

    result = this.notrequired(value);
    if (!isNone(result)) {
      return result;
    }
  }
});
