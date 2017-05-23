/* eslint-env node */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-calendar',

  included: function(app) {
    this._super.included(app);

    var options = app.options.emberCalendar || {};

    app.import(path.join(app.bowerDirectory, 'interact/interact.js'));

    app.import('vendor/ember-calendar/interact.js', {
      type: 'vendor',
      exports: { 'interact': ['default'] }
    });

    if (app.env === 'test') {
      app.import(path.join(app.bowerDirectory, 'jquery-simulate/jquery.simulate.js'), {
        type: 'test'
      });
    }
  }
};
