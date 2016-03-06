import Ember from 'ember';

const {
  Mixin,
  isArray,
  isNone,
  isEmpty
} = Ember;

export default Mixin.create({

  exclude(value) {
    let { exclude } = this.options;
    let result;

    if (isNone(exclude)) {
      return;
    }

    result = exclude.indexOf(value) === -1;

    if (!result) {
      return this.message('exclude');
    }
  },

  include(value) {
    let { include } = this.options;
    let result;

    if (isNone(include)) {
      return;
    }

    result = include.indexOf(value) !== -1;

    if (!result) {
      return this.message('include');
    }
  },

  excludeRange(value) {
    let { excludeRange } = this.options;
    let first;
    let last;
    let result;

    if (isNone(excludeRange) || isEmpty(excludeRange) || !isArray(excludeRange) || excludeRange.length !== 2) {
      return;
    }

    first = excludeRange[0];
    last = excludeRange[1];

    value = Number(value);

    if (isNaN(value) || !isFinite(value)) {
      return;
    }

    result = value < first || value > last;

    if (!result) {
      return this.message('excludeRange');
    }
  },

  includeRange(value) {
    let { includeRange } = this.options;
    let first;
    let last;
    let result;

    if (isNone(includeRange) || isEmpty(includeRange) || !isArray(includeRange) || includeRange.length !== 2) {
      return;
    }

    first = includeRange[0];
    last = includeRange[1];

    result = value >= first && value <= last;

    value = Number(value);

    if (isNaN(value) || !isFinite(value)) {
      return;
    }

    if (!result) {
      return this.message('includeRange');
    }
  },

  perform(value) {
    let result;

    if (!isNone(value)) {
      result = this.exclude(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.include(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.excludeRange(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.includeRange(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
