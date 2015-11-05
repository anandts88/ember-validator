import Ember from 'ember';

export default Ember.Mixin.create({

  perform: function() {
    var value = this.model.get(this.property);
    var first;
    var last;

    if (!Ember.isEmpty(value)) {
      if (this.options.exclude && this.options.exclude.indexOf(value) !== -1) {
        this.pushResult(this.options.messages.exclude, 'exclude');
      } else if (this.options.include && this.options.include.indexOf(value) === -1) {
        this.pushResult(this.options.messages.include, 'include');
      } else if (this.options.exludeRange) {
        first = this.options.exludeRange[0];
        last = this.options.exludeRange[1];
        if (value >= first && value <= last) {
          this.pushResult(this.options.messages.exludeRange, 'exludeRange');
        }
      } else if (this.options.includeRange) {
        first = this.options.includeRange[0];
        last = this.options.includeRange[1];
        if (value < first && value > last) {
          this.pushResult(this.options.messages.includeRange, 'includeRange');
        }
      }
    }
  }
});
