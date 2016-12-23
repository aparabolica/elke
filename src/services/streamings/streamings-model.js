'use strict';

// streamings-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const streamingsSchema = new Schema({
  title: { type: String, required: true },
  key: Schema.Types.ObjectId,
  status: { type: String, lowercase: true, trim: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const streamingsModel = mongoose.model('streamings', streamingsSchema);

module.exports = streamingsModel;
