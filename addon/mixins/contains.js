import Ember from 'ember';

const {
  Mixin,
  isArray
} = Ember;

export default Mixin.create({

  init() {
    let first;
    let last;

    this._super();

    if (this.options.exludeRange && isArray(this.options.exludeRange)) {
      first = this.options.exludeRange[0];
      last = this.options.exludeRange[1];
      this.options.exludeRange = {
        first: first,
        last: last
      };
    }

    if (this.options.includeRange && isArray(this.options.includeRange)) {
      first = this.options.includeRange[0];
      last = this.options.includeRange[1];
      this.options.includeRange = {
        first: first,
        last: last
      };
    }
  },

  perform() {
    let value = this.model.get(this.property);

    if (!Ember.isEmpty(value)) {
      if (this.options.exclude && this.options.exclude.indexOf(value) !== -1) {
        this.pushResult(this.options.messages.exclude);
      } else if (this.options.include && this.options.include.indexOf(value) === -1) {
        this.pushResult(this.options.messages.include);
      } else if (this.options.exludeRange && value >= this.options.exludeRange.first && value <= this.options.exludeRange.last) {
        this.pushResult(this.options.messages.exludeRange);
      } else if (this.options.includeRange && value < this.options.includeRange.first && value > this.options.includeRange.last) {
        this.pushResult(this.options.messages.includeRange);
      }
    }
  }
});
