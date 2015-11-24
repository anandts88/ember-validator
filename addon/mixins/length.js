import Ember from 'ember';
import { isArray, isString } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({
  init() {
    this._super();

    this.options.tokenizer = this.options.tokenizer || ((value) => value.toString().split(''));
  },

  rules: {
    is(value, options) {
      return value === options.target;
    },

    minimum(value, options) {
      return value >= options.target;
    },

    maximum(value, options) {
      return value <= options.target;
    }
  },

  perform(value) {
    let length;
    if (!isEmpty(value)) {
      if (isString(value)) {
        length = this.options.tokenizer(value).length;
      } else if (isArray(value)) {
        length = value.length;
      }

      this.process(length);
    }
  }
});
