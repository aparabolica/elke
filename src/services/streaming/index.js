'use strict';

const serveStatic = require('feathers').static;
const service = require('feathers-sequelize');
const streaming = require('./streaming-model');
const hooks = require('./hooks');
const url = require('url');

module.exports = function() {
  const app = this;

  const options = {
    Model: streaming(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  const StreamingService = service(options);

  app.use('/videos', serveStatic( process.env.DATA ));

  app.use('/streamings/control/publish', function(req, res, next) {
    var service = app.service('streamings');
    if(req.body.swfurl && req.body.name) {
      var parts = url.parse(req.body.swfurl, true);
      var key = parts.query.key;
      service.find({
        query: {
          liveKey: key,
          streamName: req.body.name,
          status: 'live'
        }
      }).then(function(queryRes) {
        if(queryRes.data.length) {
          service.patch(queryRes.data[0].id, {status: 'streaming'}).then(function() {
            res.sendStatus(200);
          }).catch(function() {
            res.sendStatus(403);
          });
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

  app.use('/streamings/control/publish_done', function(req, res, next) {
    res.sendStatus(200);
  });

  app.use('/streamings/control/record_done', function(req, res, next) {
    var service = app.service('streamings');
    if(req.body.swfurl && req.body.name) {
      var parts = url.parse(req.body.swfurl, true);
      var key = parts.query.key;
      service.find({
        query: {
          liveKey: key,
          streamName: req.body.name,
          status: 'streaming'
        }
      }).then(function(queryRes) {
        service.patch(queryRes.data[0].id, {status: 'finished'});
        res.sendStatus(200);
      }).catch(function(err) {
        res.sendStatus(200);
      });
    }
  });

  // Initialize our service with any options it requires
  app.use('/streamings', StreamingService);

  // Get our initialize service to that we can bind hooks
  const streamingService = app.service('/streamings');

  // Set up our before hooks
  streamingService.before(hooks.before);

  // Set up our after hooks
  streamingService.after(hooks.after);
};
