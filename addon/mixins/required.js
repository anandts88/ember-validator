import Ember from 'ember';

const {
  Mixin,
  get
} = Ember;

export default Mixin.create({
  perform() {
    let value = get(this.model, this.property);
    if (Ember.isBlank(value)) {
      this.pushResult(this.options.message);
    }
  }
});
