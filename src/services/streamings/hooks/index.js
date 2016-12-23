'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const crypto = require('crypto');

var createLiveKey = function(options = {}) {
  return function(hook) {
    hook.data.liveKey = crypto.randomBytes(10).toString('hex');
    return hook;
  }
};

// Should have populated user data without affecting regular queries
var authData = function(options = {}) {
  return function(hook) {
    // Should remove liveKey for non-logged in users
    console.log(hook.params.user);
    return hook;
  }
}

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    createLiveKey()
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    hooks.remove('liveKey')
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    hooks.remove('liveKey')
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ]
};

exports.after = {
  all: [
    authData()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
