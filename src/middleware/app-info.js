'use strict';

var appStatus = {
  active: true
};

const active = function(app) {
  return new Promise(function(resolve, reject) {
    var userService = app.service('users');
    userService.find({$limit: 1}).then(function(users) {
      if(users.total == 0) {
        appStatus.active = false;
      } else {
        appStatus.active = true;
      }
      resolve();
    });
  });
};

const send = function(res) {
  return function() {
    res.send(appStatus);
  }
};

module.exports = function(app) {

  return function(req, res) {
    active(app)
      .then(send(res))
      .catch(send(res));
  }

}
