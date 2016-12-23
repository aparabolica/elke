'use strict';

const service = require('feathers-mongoose');
const streamings = require('./streamings-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: streamings,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/streamings', service(options));

  // Get our initialize service to that we can bind hooks
  const streamingsService = app.service('/streamings');

  // Set up our before hooks
  streamingsService.before(hooks.before);

  // Set up our after hooks
  streamingsService.after(hooks.after);
};
