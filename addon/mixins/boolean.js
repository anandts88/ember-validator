import Ember from 'ember';

const {
  Mixin,
  get
} = Ember;

export default Mixin.create({
  init() {
    this._super();

    if (typeof(this.options.required) === 'undefined' && typeof(this.options.notrequired) === 'undefined') {
      this.options.required = true;
    }
  },

  perform() {
    let value = get(this.model, this.property);

    if (typeof(value) !== 'boolean') {
      this.pushResult(this.options.messages.boolean);
    } else if (this.options.required && !value) {
      this.pushResult(this.options.messages.required);
    } else if (this.options.notrequired && value) {
      this.pushResult(this.options.message.notrequired);
    }
  }
});
