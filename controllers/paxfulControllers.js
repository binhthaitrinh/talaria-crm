const factory = require('./handleFactory');
const Paxful = require('../models/paxfulModel');
const catchAsync = require('../utils/catchAsync');

exports.createPaxful = factory.createOne(Paxful);

// exports.getAllPaxful = factory.getAll(Paxful);
exports.getAllPaxful = catchAsync(async (req, res, next) => {
  const paxfuls = await Paxful.find().sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: paxfuls.length,
    data: {
      data: paxfuls,
    },
  });
});

exports.updatePaxful = factory.updateOne(Paxful);

exports.getStats = catchAsync(async (req, res, next) => {
  const data = await Paxful.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: '$remainingBalance.amount',
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: parseFloat(data[0].total),
    },
  });
});
