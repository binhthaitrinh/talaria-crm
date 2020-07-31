const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  sequenceValue: {
    type: Number,
    required: [true, 'A counter must have an initial sequence value'],
  },
  modelName: {
    type: String,
    unique: true,
  },
});

const counterModel = mongoose.model('Counter', counterSchema);

module.exports = counterModel;
