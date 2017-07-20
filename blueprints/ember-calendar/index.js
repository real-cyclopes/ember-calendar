/* eslint-env node */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return self.addAddonsToProject({
      packages: [{ name: 'ember-moment', target: '6.1.0' }]
    }).then(function() {
      return self.addPackagesToProject([
        { name: 'ember-cli-sass', target: '5.6.0' }
      ]);
    }).then(function() {
      return self.addBowerPackagesToProject([
        { name: 'interact', target: '1.2.8' }
      ]);
    });
  }
};
