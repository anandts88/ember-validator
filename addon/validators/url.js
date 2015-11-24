import Validator from 'ember-validator/validators/validator';

export default Validator.extend({
  rules: {
    url: function(value) {
      var pattern = /^((http|https|ftp)?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

      if (this.options.constructor === RegExp ||
        (this.options.with && this.options.with.constructor === RegExp)) {
        pattern = options;
      }

      return pattern.test(value);
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
