import Ember from 'ember';
import Validator from 'ember-validator/validators/validator';
import Messages from 'ember-validator/messages';

export default Validator.extend({
  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (!this.options.message) {
      this.set('options.message', Messages.render('notrequired', this.options));
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    if (!Ember.isEmpty(value)) {
      this.pushResult(this.options.message);
    }
  }
});
