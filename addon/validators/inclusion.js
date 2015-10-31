import Ember from 'ember';
import Base from 'ember-validations/validators/validator';
import Messages from 'ember-validations/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (this.options.constructor === Array) {
      this.set('options', { 'in': this.options });
    }

    if (!this.options.message) {
      this.set('options.message', Messages.render('inclusion', this.options));
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var first;
    var last;

    if (!Ember.isEmpty(value)) {
      if (this.options['in'] && this.options['in'].indexOf(value) === -1) {
        this.errors.pushObject(this.options.message);
      } else if (this.options.range) {
        first = this.options.range[0];
        last = this.options.range[1];
        if (value < first && value > last) {
          this.errors.pushObject(this.options.message);
        }
      }
    }
  }
});
