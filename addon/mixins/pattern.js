import Ember from 'ember';
import Messages from 'ember-validator/messages';

export default Ember.Mixin.create({
  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (this.options.constructor === RegExp) {
      this.set('options', { 'with': this.options });
    }

    if (!this.options.messages) {
      this.set('options.messages', {});
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var array;
    var arr;

    if (!Ember.isEmpty(value)) {
      if (this.options.with && !this.options.with.test(value)) {
        this.pushResult(this.options.messages.with, 'with');
      } else if (this.options.without && this.options.without.test(value)) {
        this.pushResult(this.options.messages.without, 'without');
      } else if (!Ember.isEmpty(this.options.array)) {
        array = this.options.array;
        for (var count = 0 ; count < array.length ; count++) {
          arr = array[count];
          if (arr.with && !arr.with.test(value)) {
            this.pushResult(arr.message, 'array');
            break;
          } else if (arr.without && arr.without.test(value)) {
            this.pushResult(arr.message, 'array');
            break;
          }
        }
      }
    }
  }
});
