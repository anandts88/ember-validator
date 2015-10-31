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

    if (this.options.constructor === RegExp) {
      this.set('options', { 'with': this.options });
    }

    if (this.options.messages === undefined) {
      set(this, 'options.messages', {});
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var array;
    var arr;

    if (!Ember.isEmpty(value)) {
      if (this.options.with && !this.options.with.test(value)) {
        this.errors.pushObject(this.options.messages.with);
      } else if (this.options.without && this.options.without.test(value)) {
        this.errors.pushObject(this.options.messages.without);
      } else if (!Ember.isEmpty(this.options.array)) {
        array = this.options.array;
        for (var count = 0 ; count < array.length ; count++) {
          arr = array[count];
          if (arr.with && !arr.with.test(value)) {
            this.errors.pushObject(arr.message);
            break;
          } else if (arr.without && !arr.without.test(value)) {
            this.errors.pushObject(arr.message);
            break;
          }
        }
      }
    }
  }
});
