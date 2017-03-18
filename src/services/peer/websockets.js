'use strict';

const url = require('url');

exports = module.exports = {};

/** Initialize WebSocket server. */
exports._initializeWSS = function(app) {
  var self = this;

  if (this.mountpath instanceof Array) {
    throw new Error("This app can only be mounted on a single path");
  }

  var path = this.mountpath;
  var path = path + (path[path.length - 1] != '/' ? '/' : '') + 'peerjs';

  console.log(path);

  // Create WebSocket server as well.
  this._wss = app.io;

  app.io.use(function(socket, next) {
    // console.log(socket);
    next();
  });

  this._wss.on('connection', function(socket) {
    var query = url.parse(socket.request.url, true).query;
    var id = query.id;
    var token = query.token;
    var key = query.key;
    var ip = socket.request.socket.remoteAddress;

    if (!id || !token || !key) {
      socket.send(JSON.stringify({ type: 'ERROR', payload: { msg: 'No id, token, or key supplied to websocket server' } }));
      return;
    }

    if (!self._clients[key] || !self._clients[key][id]) {
      self._checkKey(key, ip, function(err) {
        if (!err) {
          if (!self._clients[key][id]) {
            self._clients[key][id] = { token: token, ip: ip };
            self._ips[ip]++;
            socket.send(JSON.stringify({ type: 'OPEN' }));
          }
          self._configureWS(socket, key, id, token);
        } else {
          socket.send(JSON.stringify({ type: 'ERROR', payload: { msg: err } }));
        }
      });
    } else {
      self._configureWS(socket, key, id, token);
    }
  });
};

exports._configureWS = function(socket, key, id, token) {

  var self = this;
  var client = this._clients[key][id];

  if (token === client.token) {
    // res 'close' event will delete client.res for us
    client.socket = socket;
    // Client already exists
    if (client.res) {
      client.res.end();
    }
  } else {
    // ID-taken, invalid token
    socket.send(JSON.stringify({ type: 'ID-TAKEN', payload: { msg: 'ID is taken' } }));
    socket.close();
    return;
  }

  this._processOutstanding(key, id);

  // Cleanup after a socket closes.
  socket.on('close', function() {
    self._log('Socket closed:', id);
    if (client.socket == socket) {
      self._removePeer(key, id);
    }
  });

  // Handle messages from peers.
  socket.on('message', function(data) {
    try {
      var message = JSON.parse(data);

      if (['LEAVE', 'CANDIDATE', 'OFFER', 'ANSWER'].indexOf(message.type) !== -1) {
        self._handleTransmission(key, {
          type: message.type,
          src: id,
          dst: message.dst,
          payload: message.payload
        });
      } else {
        util.prettyError('Message unrecognized');
      }
    } catch(e) {
      self._log('Invalid message', data);
      throw e;
    }
  });

  // We're going to emit here, because for XHR we don't *know* when someone
  // disconnects.
  this.emit('connection', id);
};
