import Ember from 'ember';
import Pattern from 'ember-validator/mixins/pattern';
import Constants from 'ember-validator/constants';

const {
  Mixin,
  get,
  set
} = Ember;

export default Mixin.create(Pattern, {
  pattern: Constants.ZIP_PATTERN,

  init() {
    this._super();

    if (!this.options.with) {
      set(this, 'options.with', get(this, 'pattern'));
    }

    this.options.messages.with = this.options.message;
  }
});
