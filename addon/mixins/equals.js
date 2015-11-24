import Ember from 'ember';
import { isString } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({
  rules: {
    accept(value, options) {
      let source = value;
      let target = options.target;

      if (this.options.ignoreCase && isString(source) && isString(target)) {
        source = source.toUpperCase();
        target = target.toUpperCase();
      }

      return source === target;
    },

    reject(value, options) {
      let source = value;
      let target = options.target;

      if (this.options.ignoreCase && isString(source) && isString(target)) {
        source = source.toUpperCase();
        target = target.toUpperCase();
      }

      return source !== target;
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(value);
    }
  }
});
