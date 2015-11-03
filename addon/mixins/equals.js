import Ember from 'ember';
import Messages from 'ember-validator/messages';

export default Ember.Mixin.create({
  init: function() {
    this._super();

    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (!this.options.message) {
      this.set('options.message', Messages.render('equals', this.options));
    }
  },

  perform: function() {
    var value = this.model.get(this.property);

    if (!Ember.isEmpty(value)) {
      if (this.options.accept && value !== this.options.accept) {
        this.pushResult(this.options.message);
      }
    }
  }
});
