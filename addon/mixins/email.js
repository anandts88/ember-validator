import Ember from 'ember';
import Constants from 'ember-validator/constants';
import { isRegexp } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

const { EMAIL_PATTERN } = Constants;

export default Mixin.create({
  rules: {
    email(value) {
      let pattern = EMAIL_PATTERN;

      if (isRegexp(this.options) || (this.options.with && isRegexp(this.options))) {
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
