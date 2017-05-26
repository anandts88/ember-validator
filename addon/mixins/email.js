import Ember from 'ember';
import Constants from 'ember-validator/constants';
import Pattern from 'ember-validator/mixins/pattern';

const {
  Mixin,
  get,
  set
} = Ember;

export default Mixin.create(Pattern, {
  pattern: Constants.EMAIL_PATTERN,

  init() {
    this._super();

    if (!this.options.with) {
      set(this, 'options.with', get(this, 'pattern'));
    }

    this.options.messages.with = this.options.message;
  }
});
