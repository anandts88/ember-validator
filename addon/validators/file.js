import Validator from 'ember-validator/validators/validator';
import Utils from 'ember-validator/utils';

export default Validator.extend({

  rules: {

    minimum: function(files, options) {
      return files.length >= options.target;
    },

    maximum: function(files, options) {
      return files.length <= options.target;
    },

    equalTo: function(files, options) {
      return files.length === options.target;
    },

    extension: function(files, options) {
      var valid = true;
      var extension;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          extension = files[count].substr(file.lastIndexOf('.') + 1);
          if (options.target.indexOf(extension) === -1) {
            valid = false;
            break;
          }
        }
      } else {
        extension = files.substr(file.lastIndexOf('.') + 1);
        if (options.target.indexOf(extension) === -1) {
          valid = false;
        }
      }


      return valid;
    },

    type: function(files, options) {
      var valid = true;
      var type;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          type = files[count].type;
          if (options.target.indexOf(type) === -1) {
            valid = false;
            break;
          }
        }
      } else {
        type = files.type;
        if (options.target.indexOf(type) === -1) {
          valid = false;
        }
      }

      return valid;
    },

    maximumSize: function(files, options) {
      var valid = true;
      var size;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          size = files[count].size;
          if (size <= options.target) {
            valid = false;
            break;
          }
        }
      } else {
        size = files.size;
        if (size <= options.target) {
          valid = false;
        }
      }


      return valid;
    },

    minimumSize: function(files, options) {
      var valid = true;
      var size;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          size = files[count].size;
          if (size >= (options.target || 0)) {
            valid = false;
            break;
          }
        }
      } else {
        size = files.size;
        if (size >= (options.target || 0)) {
          valid = false;
        }
      }

      return valid;
    },

    equalToSize: function(files, options) {
      var valid = true;
      var size;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          size = files[count].size;
          if (size === (options.target || 0)) {
            valid = false;
            break;
          }
        }
      } else {
        size = files.size;
        if (size === (options.target || 0)) {
          valid = false;
        }
      }

      return valid;
    },

    maximumTotalSize: function(files, options) {
      var valid = true;
      var size  = 0;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size <= options.target;
    },

    minimumTotalSize: function(files, options) {
      var valid = true;
      var size  = 0;

      if (Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size >= options.target;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }

});
