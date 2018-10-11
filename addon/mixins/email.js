import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';
import Constants from 'ember-validator/constants';
import Pattern from 'ember-validator/mixins/pattern';

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
