import Ember from 'ember';
import Pattern from 'ember-validator/mixins/pattern';
import Messages from 'ember-validator/messages';

export default Ember.Mixin.create(Pattern, {
  pattern: /^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/,

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
      this.set('options.message', Messages.render('ssn', this.options));
    }

    this.options.messages.with = this.options.message;
  }
});
