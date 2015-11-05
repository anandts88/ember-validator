import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super();

    if (typeof(this.options.required) === 'undefined' && typeof(this.options.notrequired) === 'undefined') {
      this.options.required = true;
    }
  },

  perform: function() {
    var value = this.model.get(this.property);

    if (typeof(value) !== 'boolean') {
      this.pushResult(this.options.messages.boolean);
    } else if (this.options.required && !value) {
      this.pushResult(this.options.messages.required);
    } else if (this.options.notrequired && value) {
      this.pushResult(this.options.message.notrequired);
    }
  }
});
