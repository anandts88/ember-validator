import Ember from 'ember';
import Base from 'ember-validator/validators/validator';
import Messages from 'ember-validator/messages';

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
      } else if (this.options.exludeRange) {
        first = this.options.exludeRange[0];
        last = this.options.exludeRange[1];
        if (value >= first && value <= last) {
          this.errors.pushObject(this.options.messages.exludeRange);
        }
      } else if (this.options.includeRange) {
        first = this.options.includeRange[0];
        last = this.options.includeRange[1];
        if (value < first && value > last) {
          this.errors.pushObject(this.options.messages.includeRange);
        }
      }
    }
  }
});
