import Ember from 'ember';
import Constants from 'ember-validator/constants';
import Pattern from 'ember-validator/mixins/pattern';

const {
  Mixin
} = Ember;

export default Mixin.create(Pattern, {
  pattern: Constants.EMAIL_PATTERN,

  init() {
    this._super();

    if (!this.options.with) {
      this.set('options.with', this.get('pattern'));
    }

    this.options.messages.with = this.options.message;
  }
});
