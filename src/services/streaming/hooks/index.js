'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const handleStatus = require('./handle-status');
const encode = require('./encode');

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    globalHooks.createRandom('liveKey', 10),
    globalHooks.createRandom('streamName', 10)
  ],
  update: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    handleStatus(),
    hooks.remove('liveKey'),
    hooks.remove('streamName')
  ],
  patch: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    handleStatus(),
    hooks.remove('liveKey'),
    hooks.remove('streamName'),
    encode()
  ],
  remove: [
    auth.verifyToken(),
    auth.restrictToAuthenticated()
  ]
};

exports.after = {
  all: [
    hooks.iff(hooks.isNot(globalHooks.loggedIn()), hooks.remove('liveKey'))
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
