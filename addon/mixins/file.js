import Ember from 'ember';
import Utils from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({
  rules: {

    greaterThanEqualTo(files, options) {
      if (files instanceof FileList || Utils.isArray(files)) {
        return files.length >= options.target;
      } else {
        return true;
      }
    },

    lessThanEqualTo(files, options) {
      if (files instanceof FileList || Utils.isArray(files)) {
        return files.length <= options.target;
      } else {
        return true;
      }
    },

    equalTo(files, options) {
      if (files instanceof FileList || Utils.isArray(files)) {
        return files.length === options.target;
      } else {
        return true;
      }
    },

    greaterThan(files, options) {
      if (files instanceof FileList || Utils.isArray(files)) {
        return files.length > options.target;
      } else {
        return true;
      }
    },

    lessThan(files, options) {
      if (files instanceof FileList || Utils.isArray(files)) {
        return files.length < options.target;
      } else {
        return true;
      }
    },

    notEqualTo(files, options) {
      if (files instanceof FileList || Utils.isArray(files)) {
        return files.length !== options.target;
      } else {
        return true;
      }
    },

    extension(files, options) {
      var valid = true;
      var extension;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          extension = files[count].name.substr(files[count].name.lastIndexOf('.') + 1);
          if (options.target.indexOf(extension) === -1) {
            valid = false;
            break;
          }
        }
      } else {
        extension = files.name.substr(files.name.lastIndexOf('.') + 1);
        if (options.target.indexOf(extension) === -1) {
          valid = false;
        }
      }


      return valid;
    },

    type(files, options) {
      var valid = true;
      var type;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
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

    sizeLessThanEqualTo(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          valid = files[count].size <= options.target;
          if (!valid) {
            break;
          }
        }
      } else {
        valid = files.size <= options.target;
      }

      return valid;
    },

    sizeGreaterThanEqualTo(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          valid = files[count].size >= options.target;
          if (!valid) {
            break;
          }
        }
      } else {
        valid = files.size >= options.target;
      }

      return valid;
    },

    sizeEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          valid = files[count].size === options.target;
          if (!valid) {
            break;
          }
        }
      } else {
        valid = files.size === options.target;
      }

      return valid;
    },

    sizeLessThan: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          valid = files[count].size < options.target;
          if (!valid) {
            break;
          }
        }
      } else {
        valid = files.size < options.target;
      }

      return valid;
    },

    sizeGreaterThan: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          valid = files[count].size > options.target;
          if (!valid) {
            break;
          }
        }
      } else {
        valid = files.size > options.target;
      }

      return valid;
    },

    sizeNotEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          valid = files[count].size !== options.target;
          if (!valid) {
            break;
          }
        }
      } else {
        valid = files.size !== options.target;
      }

      return valid;
    },

    totalSizeLessThanEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size <= options.target;
    },

    totalSizeGreaterThanEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size >= options.target;
    },

    totalSizeEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size === options.target;
    },

    totalSizeLessThanEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size < options.target;
    },

    totalSizeGreaterThanEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size > options.target;
    },

    totalSizeNotEqualTo: function(files, options) {
      let valid = false;

      if (files instanceof FileList || Utils.isArray(files)) {
        for (let count = 0 ; count < files.length ; count++) {
          size += files[count].size;
        }
      } else {
        size = files.size;
      }

      return size !== options.target;
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});
