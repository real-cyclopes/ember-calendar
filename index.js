'use strict';

module.exports = {
  name: 'ember-calendar',
  included: function(app) {
    this._super.included.apply(this, arguments);
    app.import('node_modules/interactjs/dist/interact.js', {
      using: [{ transformation: 'amd', as: 'interact' }]
    });
  }
};
