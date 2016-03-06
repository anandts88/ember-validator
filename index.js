/* jshint node: true */
'use strict';
var path = require('path');

module.exports = {
  name: 'ember-validator',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function(app, parentAddon) {
    var _app = app;
    var _options;
    var _useDateValidator;

    // Quick fix for add-on nesting
    // https://github.com/ember-cli/ember-cli/issues/3718
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    if (typeof app.import !== 'function' && app.app) {
      _app = app.app;
    }

    // https://github.com/ember-cli/ember-cli/issues/3718#issuecomment-88122543
    this._super.included.call(this, _app);

    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    _app = (parentAddon || _app || {});

    _app.options = _app.options || {};
    _options = _app.options.emberValidator || {
      useDateValidator: true
    };

    _useDateValidator = _options.useDateValidator;

    if (typeof(_useDateValidator) !== 'boolean') {
      _useDateValidator = true;
    }

    // Import moment library only when `useDateValidator` is set to true. By default moment library is imported.
    // If you dont want to use date validator then set `useDateValidator` to false.
    if (_app.import && _useDateValidator) {
      this.importBowerDependencies(_app);
    }
  },

  importBowerDependencies: function(app) {
    app.import(app.bowerDirectory + '/moment/moment.js');
  }
};
