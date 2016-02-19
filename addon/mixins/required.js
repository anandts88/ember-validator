import Ember from 'ember';

const {
  Mixin
} = Ember;

export default Mixin.create({
  perform() {
    let value = this.model.get(this.property);
    if (Ember.isBlank(value)) {
      this.pushResult(this.options.message);
    }
  }
});
