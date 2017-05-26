import Ember from 'ember';

const {
  Mixin,
  get
} = Ember;

export default Mixin.create({
  perform() {
    let value = get(this.model, this.property);

    if (!Ember.isEmpty(value)) {
      if (this.options.accept && value !== this.options.accept) {
        this.pushResult(this.options.message);
      } else if (this.options.reject && value === this.options.reject) {
        this.pushResult(this.options.message);
      }
    }
  }
});
