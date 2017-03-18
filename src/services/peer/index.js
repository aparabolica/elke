'use strict';

const express = require('express');
const peer = require('peer/lib/server');
const util = require('peer/lib/util');
const Proto = require('uberproto');
const url = require('url');
const websockets = require('./websockets');

const peerApp = util.extend(util.extend(express(), peer), websockets);

const options = peerApp._options = {
  debug: true,
  timeout: 5000,
  key: 'peerjs',
  ip_limit: 5000,
  concurrent_limit: 5000,
  allow_discovery: false,
  proxied: false
};

// Connected clients
peerApp._clients = {};

// Messages waiting for another peer.
peerApp._outstanding = {};

// Mark concurrent users per ip
peerApp._ips = {};

if (options.proxied) {
  peerApp.set('trust proxy', options.proxied);
}

module.exports = function() {
  const app = this;
  app.use('/ws/peer', peerApp);
  Proto.mixin({
    setup (server) {
      peerApp._initializeHTTP();
      peerApp._setCleanupIntervals();
      var result = this._super.apply(this, arguments);
      peerApp._initializeWSS(app);
      return result;
    }
  }, app);
};
