import Ember from 'ember';

export default Ember.Mixin.create({
  perform: function() {
    var value = this.model.get(this.property);
    var array;
    var arr;

    if (!Ember.isEmpty(value)) {
      if (this.options.with && !this.options.with.test(value)) {
        this.pushResult(this.options.messages.with);
      } else if (this.options.without && this.options.without.test(value)) {
        this.pushResult(this.options.messages.without);
      } else if (!Ember.isEmpty(this.options.array)) {
        array = this.options.array;
        for (var count = 0 ; count < array.length ; count++) {
          arr = array[count];
          if (arr.with && !arr.with.test(value)) {
            this.pushResult(arr.message || this.options.messages.array);
            break;
          } else if (arr.without && arr.without.test(value)) {
            this.pushResult(arr.message || this.options.messages.array);
            break;
          }
        }
      }
    }
  }
});
