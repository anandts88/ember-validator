import Ember from 'ember';

const {
  Mixin,
  isNone,
  isArray,
  isEmpty
} = Ember;

export default Mixin.create({
  init() {
    this._super();

    this.options.tokenizer = this.options.tokenizer || ((value) => value.toString().split(''));
  },

  is(value) {
    let { is } = this.options;
    let result;

    if (isNone(is)) {
      return;
    }

    result = value.length === is;

    if (!result) {
      return this.message('is', { is });
    }
  },

  minimum(value) {
    let { minimum } = this.options;
    let result;

    if (isNone(minimum)) {
      return;
    }

    result = value.length >= minimum;

    if (!result) {
      return this.message('minimum', { minimum });
    }
  },

  maximum(value) {
    let { maximum } = this.options;
    let result;

    if (isNone(maximum)) {
      return;
    }

    result = value.length <= maximum;

    if (!result) {
      return this.message('maximum', { maximum });
    }
  },

  lessThan() {
    let { lessThan } = this.options;
    let result;

    if (isNone(lessThan)) {
      return;
    }

    result = value.length < lessThan;

    if (!result) {
      return this.message('lessThan', { lessThan });
    }
  },

  greaterThan() {
    let { greaterThan } = this.options;
    let result;

    if (isNone(greaterThan)) {
      return;
    }

    result = value.length > greaterThan;

    if (!result) {
      return this.message('greaterThan', { greaterThan });
    }
  },


  perform(value) {
    let result;
    if (!isNone(value)) {

      if (!isArray(value)) {
        value = `${value}`;
      }

      if (typeof(value) === 'string') {
        value = this.options.tokenizer(value); // Split value based on tokenizer, by default no of characters is counted as length
      }

      result = this.is(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.greaterThan(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.minimum(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.lessThan(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.maximum(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});
