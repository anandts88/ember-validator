/* eslint-env node */
'use strict';
var path = require('path');

module.exports = {
  name: require('./package').name,

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function(app, parentAddon) {
    // https://github.com/ember-cli/ember-cli/issues/3718#issuecomment-88122543
    this._super.included.apply(this, arguments);

    var _options;
    var _useDateValidator;

    var target = parentAddon || app;

    // allow addon to be nested - see: https://github.com/ember-cli/ember-cli/issues/3718
    if (target.app) {
      target = target.app;
    }

    target.options = target.options || {};

    _options = target.options.emberValidator || { useDateValidator: true };

    _useDateValidator = _options.useDateValidator;

    if (typeof(_useDateValidator) !== 'boolean') {
      _useDateValidator = true;
    }

    // Import moment library only when `useDateValidator` is set to true. By default moment library is imported.
    // If you dont want to use date validator then set `useDateValidator` to false.
    if (target.import && _useDateValidator) {
      this.importBowerDependencies(target);
    }
  },

  importBowerDependencies: function(app) {
    app.import(app.bowerDirectory + '/moment/moment.js');
  }
};
