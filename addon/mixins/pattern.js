import Ember from 'ember';

export default Ember.Mixin.create({

  rules: {
    hasAlphabet: function(value) {
      return /(?=.*[a-z]|[A-Z])/.test(value);
    },

    hasUpperCase: function(value) {
      return /(?=.*[A-Z])/.test(value);
    },

    hasLowerCase: function(value) {
      return /(?=.*[a-z])/.test(value);
    },

    hasNumber: function(value) {
      return /(?=.*\d)/.test(value);
    },

    hasSpecial: function(value, options) {
      var specialTest;

      if (typeof(options.target) === 'string') {
        specialTest = new RegExp('(?=.*[' + options + '])').test(value);
      } else if (options.target.constructor === RegExp) {
        specialTest = options.target.test(value);
      } else {
        specialTest = new RegExp('(?=.*[!@$%^&*()-+_=~`{}:;"\'<>,.|?])').test(value);
      }

      return specialTest;
    },

    hasNoSpecial: function(value) {
      return /^[a-zA-Z0-9]+$/.test(value);
    },

    hasNoSpace: function(value) {
      return !/[\s]/.test(value);
    },

    with: function(value, options) {
      return options.target.test(value);
    },

    without: function(value, options) {
      return !options.target.test(value);
    },

    array: function(value, options) {
      var arr;
      var valid = [];

      for (var count = 0 ; count < options.target.length ; count++) {
        valid.push(true);
        arr = options.target[count];
        if (arr.with && !arr.with.test(value)) {
          valid[count] = false;
          break;
        } else if (arr.without && arr.without.test(value)) {
          valid[count] = false;
          break;
        }
      }

      return valid;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
