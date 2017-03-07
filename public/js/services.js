angular.module('elke')

.factory('Elke', [
  function() {
    var config = {};
    return {
      set: function(key, val) {
        config[key] = val;
        return config[key];
      },
      get: function(key) {
        if(config[key])
          return config[key];
        else
          return false;
      }
    }
  }
]);
