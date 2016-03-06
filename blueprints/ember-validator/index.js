var RSVP = require('rsvp');

/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return RSVP.all([
      this.addBowerPackageToProject('moment', '~2.10.6')
    ]);
  }
};
