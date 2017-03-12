'use strict';

const serveStatic = require('feathers').static;
const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');
const appInfo = require('./app-info');
const rtmpStats = require('./rtmp-stats');
const expressLess = require('express-less');

module.exports = function() {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;

  app.use('/styles', expressLess( 'public/styles', {compress: true}));
  app.use('/assets', serveStatic( 'bower_components', {maxAge: 31536000} ));
  app.use('/app', appInfo(app));
  app.use('/rtmp_stats', rtmpStats(app));

  app.use(notFound());
  app.use(logger(app));
  app.use(handler());
};
