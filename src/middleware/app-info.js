'use strict';

const appInfo = {
  active: true
};

const hasUsers = (app) => {
  return new Promise((resolve, reject) => {
    let userService = app.service('users');
    userService.find({$limit: 1}).then(users => {
      if(users.total == 0) {
        appInfo.active = false;
      } else {
        appInfo.active = true;
      }
      resolve();
    });
  });
};

const getHost = function(app) {
  return new Promise((resolve, reject) => {
    appInfo.host = app.get('host');
    resolve();
  });
}

const send = res => {
  return () => {
    res.send(appInfo);
  };
};

module.exports = app => {
  return (req, res) => {
    hasUsers(app)
    getHost(app)
      .then(send(res))
      .catch(send(res));
  };
};
