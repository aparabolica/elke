'use strict';

const service = require('feathers-sequelize');
const comment = require('./comment-model');
const hooks = require('./hooks');
const url = require('url');

module.exports = function() {
  const app = this;

  const options = {
    Model: comment(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  const CommentService = service(options);

  // Initialize our service with any options it requires
  app.use('/comments', CommentService);

  // Get our initialize service to that we can bind hooks
  const commentService = app.service('/comments');

  // Set up our before hooks
  commentService.before(hooks.before);

  // Set up our after hooks
  commentService.after(hooks.after);
};
