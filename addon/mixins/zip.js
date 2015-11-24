import Ember from 'ember';
import Constants from 'ember-validator/constants';
import { isRegexp } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

const { ZIP_PATTERN } = Constants;

export default Mixin.create({

  rules: {
    zip(value) {
      let pattern = ZIP_PATTERN;

      if (isRegexp(this.options) || (this.options.with && isRegexp(this.options.with))) {
        pattern = options;
      }

      return pattern.test(value);
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      this.process(value);
    }
  }
});
