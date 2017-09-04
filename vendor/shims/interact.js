(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['interact'],
      __esModule: true,
    };
  }

  define('interact', [], vendorModule);
})();
