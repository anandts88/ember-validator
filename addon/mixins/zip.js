import Ember from 'ember';
import Pattern from 'ember-validator/mixins/pattern';
import Constants from 'ember-validator/constants';

const {
  Mixin
} = Ember;

export default Mixin.create(Pattern, {
  pattern: Constants.ZIP_PATTERN,

  init() {
    this._super();

    if (!this.options.with) {
      this.set('options.with', this.get('pattern'));
    }

    this.options.messages.with = this.options.message;
  }
});
