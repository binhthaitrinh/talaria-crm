const catchAsync = require('../utils/catchAsync');
const Paxful = require('../models/paxfulModel');
const GiftCard = require('../models/giftCardModel');

exports.getStats = catchAsync(async (req, res, next) => {
  const month = 2;
  const paxfuls = await Paxful.aggregate([
    {
      $unwind: '$createdAt',
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(2020, 01, 01),
          $lte: new Date(2020, 12, 31),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        numPaxful: { $sum: 1 },
        totalBtc: { $sum: '$btcAmount' },
        totalRemaining: { $sum: '$remainingBalance.amount' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
  ]);

  paxfuls.forEach((px) => {
    console.log('================================');
    console.log(parseFloat(px.totalBtc));
    console.log(px.month);
    console.log(parseFloat(px.totalRemaining));
    console.log('================================');
  });

  res.status(200).json({
    status: 'success',
    data: 1,
  });
});
