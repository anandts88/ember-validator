import Ember from 'ember';
import Pattern from 'ember-validator/mixins/pattern';
import Messages from 'ember-validator/messages';
import Constants from 'ember-validator/constants';

export default Ember.Mixin.create(Pattern, {
  pattern: Constants.ZIP_PATTERN,

  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (this.options.constructor === RegExp) {
      this.set('options', { 'with': this.options });
    }

    if (!this.options.with) {
      this.set('options.with', this.get('pattern'));
    }

    if (!this.options.message) {
      this.set('options.message', Messages.render('zip', this.options));
    }

    this.options.messages.with = this.options.message;
  }
});
