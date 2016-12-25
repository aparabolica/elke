'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const handleStatus = require('./handle-status');
const crypto = require('crypto');

const createLiveKey = (options = {}) => hook => {
  hook.data.liveKey = crypto.randomBytes(10).toString('hex');
  return hook;
};
const createStreamName = (options = {}) => hook => {
  hook.data.streamName = crypto.randomBytes(10).toString('hex');
  return hook;
};

const loggedIn = () => hook => !!hook.params.user;

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    createLiveKey(),
    createStreamName()
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
    hooks.remove('streamName')
  ],
  remove: [
    auth.verifyToken(),
    auth.restrictToAuthenticated()
  ]
};

exports.after = {
  all: [
    hooks.iff(hooks.isNot(loggedIn()), hooks.remove('liveKey'))
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
