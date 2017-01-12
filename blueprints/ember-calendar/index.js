/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return self.addAddonsToProject({
      packages: [{ name: 'ember-moment', target: '6.1.0' }]
    }).then(function() {
      return self.addPackagesToProject([
        { name: 'ember-cli-sass', target: '5.6.0' },
        { name: 'ember-rl-dropdown', target: '0.10.0' },
        { name: 'liquid-fire', target: '0.27.0' }
      ]);
    }).then(function() {
      return self.addBowerPackagesToProject([
        { name: 'interact', target: '1.2.8' },
        { name: 'jquery-simulate', target: '1.0.1' },
        { name: 'lodash', target: '3.10.0' },
      ]);
    });
  }
};
