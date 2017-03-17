'use strict';
const streaming = require('./streaming');
const comment = require('./comment');
const authentication = require('./authentication');
const user = require('./user');
const peer = require('./peer');
const Sequelize = require('sequelize');
module.exports = function() {
  const app = this;

  const sequelize = new Sequelize(app.get('postgres'), {
    dialect: 'postgres',
    logging: false
  });
  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(streaming);
  app.configure(comment);
  app.configure(peer);
};
