/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-calendar',
  included: function(app) {
    this._super.included.apply(this, arguments);
    app.import('node_modules/interactjs/interact.js');
    app.import('vendor/shims/interact.js');
  }
};
