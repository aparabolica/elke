'use strict';

const service = require('feathers-mongoose');
const streamings = require('./streamings-model');
const hooks = require('./hooks');
const url = require('url');

module.exports = function() {
  const app = this;

  const options = {
    Model: streamings,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/streamings/publish', function(req, res, next) {
    var Streamings = app.service('streamings');
    if(req.body.swfurl) {
      var parts = url.parse(req.body.swfurl, true);
      var key = parts.query.key;
      Streamings.find({
        query: {
          liveKey: key
        }
      }).then(function(res) {
        if(res.data.length) {
          console.log('ok');
          // Not working
          res.sendStatus(200);
        } else {
          res.sendStatus(403);
        }
      }).catch(function(err) {
        res.sendStatus(403);
      });
    } else {
      res.sendStatus(403);
    }
  });

  app.use('/streamings/publish_done', function(req, res, next) {
    res.sendStatus(200);
  });

  // Initialize our service with any options it requires
  app.use('/streamings', service(options));

  // Get our initialize service to that we can bind hooks
  const streamingsService = app.service('/streamings');

  // Set up our before hooks
  streamingsService.before(hooks.before);

  // Set up our after hooks
  streamingsService.after(hooks.after);
};
