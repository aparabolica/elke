'use strict';

// streaming-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const streaming = sequelize.define('streamings', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    status: {
      type: Sequelize.ENUM('pending', 'live', 'streaming', 'finished', 'encoding', 'encoded'),
      defaultValue: 'pending'
    },
    liveKey: {
      type: Sequelize.STRING
    },
    streamName: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true
  });

  streaming.sync();

  return streaming;
};
