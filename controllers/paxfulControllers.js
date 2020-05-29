const factory = require('./handleFactory');
const paxfulModel = require('../models/paxfulModel');

exports.createPaxful = factory.createOne(paxfulModel);

exports.getAllPaxful = factory.getAll(paxfulModel);

exports.updatePaxful = factory.updateOne(paxfulModel);
