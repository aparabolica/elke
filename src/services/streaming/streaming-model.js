'use strict';

// streaming-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const streamingSchema = new Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'pending',
      'live',
      'streaming',
      'finished',
      'encoding',
      'encoded'
    ],
    default: 'pending'
  },
  liveKey: { type: String },
  streamName: { type: String },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const streamingModel = mongoose.model('streaming', streamingSchema);

module.exports = streamingModel;
