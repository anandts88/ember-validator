import Ember from 'ember';

export default Ember.Mixin.create({
  perform: function() {
    var value = this.model.get(this.property);
    if (Ember.isBlank(value)) {
      this.pushResult(this.options.message);
    }
  }
});
