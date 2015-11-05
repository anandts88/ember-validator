import Ember from 'ember';
import Constants from 'ember-validator/constants';
import Pattern from 'ember-validator/mixins/pattern';

export default Ember.Mixin.create(Pattern, {
  pattern: Constants.EMAIL_PATTERN,

  init: function() {
    this._super();

    if (!this.options.with) {
      this.set('options.with', this.get('pattern'));
    }

    this.options.messages.with = this.options.message;
  }
});
