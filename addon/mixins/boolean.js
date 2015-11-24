import Ember from 'ember';
import { isUndefined } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({
  init() {
    this._super();

    if (isUndefined(this.options.required) && isUndefined(this.options.notrequired)) {
      this.options.required = true;
    }
  },

  rules: {
    boolean(value) {
      return typeof(value) === 'boolean';
    },

    required(value) {
      return value;
    },

    notrequired(value) {
      return !value;
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(value);
    }
  }
});
