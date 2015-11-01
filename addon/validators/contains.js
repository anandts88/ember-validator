import Ember from 'ember';
import Base from 'ember-validator/validators/validator';
import Messages from 'ember-validator/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (!this.options.messages) {
      this.set('options.messages', {});
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var first;
    var last;

    if (!Ember.isEmpty(value)) {
      if (this.options.exclude && this.options.exclude.indexOf(value) !== -1) {
        this.errors.pushObject(this.options.messages.exclude);
      } else if (this.options.include && this.options.include.indexOf(value) === -1) {
        this.errors.pushObject(this.options.messages.include);
      }
    }
  }
});
