'use strict';

const peer = require('peer').ExpressPeerServer;
const Proto = require('uberproto');

module.exports = function() {
  const app = this;
  // app.use('/peer', peer(app, {debug: true}));
  Proto.mixin({
    setup (server) {
      app.use('/peer', peer(server, {debug: true}));
      return this._super.apply(this, arguments);
    }
  }, app);
};
