import Ember from 'ember';
import Pattern from 'ember-validator/mixins/pattern';
import Constants from 'ember-validator/constants';

export default Ember.Mixin.create(Pattern, {
  pattern: Constants.ZIP_PATTERN,

  init: function() {
    this._super();

    if (!this.options.with) {
      this.set('options.with', this.get('pattern'));
    }

    this.options.messages.with = this.options.message;
  }
});
