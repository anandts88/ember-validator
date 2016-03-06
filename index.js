/* jshint node: true */
'use strict';
var path = require('path'); 

module.exports = {
  name: 'ember-validator',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function(app) {
    this._super.included(app);
    if (app.import) {
      this.importBowerDependencies(app);
    }
  },

  importBowerDependencies: function(app) {
    app.import(app.bowerDirectory + '/moment/min/moment.min.js');
  }
};
