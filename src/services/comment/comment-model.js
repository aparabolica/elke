'use strict';

// comment-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const comment = sequelize.define('comments', {
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT
    },
    streamingId: {
      type: Sequelize.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        comment.belongsTo(models.streamings);
      }
    },
    freezeTableName: true
  });

  comment.sync();

  return comment;
};
