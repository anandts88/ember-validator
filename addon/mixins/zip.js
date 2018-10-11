import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';
import Pattern from 'ember-validator/mixins/pattern';
import Constants from 'ember-validator/constants';

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
