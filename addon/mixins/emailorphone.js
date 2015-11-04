import Ember from 'ember';
import Phone from 'ember-validator/mixins/phone';
import Constants from 'ember-validator/constants';

export default Ember.Mixin.create(Phone, {
  pattern: Constants.EMAIL_PATTERN,

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
      this.set('options.message', Messages.render('emailorphone', this.options));
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    if (this.options.with && !this.options.with.test(value)) {
      this._super();

      if (this.get('isInvalid')) {
        this.pushResult(this.options.message);
      }
    }
  }
});
