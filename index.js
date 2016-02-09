/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-validator',
  included: function(app) {
    if (app.import) {
      this.importBowerDependencies(app);
    }
  },

  importBowerDependencies: function(app) {
    app.import(app.bowerDirectory + '/lodash/lodash.min');
    app.import(app.bowerDirectory + '/moment/min/moment.min.js');
  }
};
