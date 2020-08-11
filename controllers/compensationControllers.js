const Compensation = require('../models/compensationModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.getCompensations = factory.getAll(Compensation);

exports.createCompensation = factory.createOne(Compensation);

exports.getCompensation = factory.getOne(Compensation);

exports.updateCompensation = factory.updateOne(Compensation);

exports.deleteCompensation = factory.deleteOne(Compensation);

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

exports.getMonthlyCompensations = catchAsync(async (req, res, next) => {
  const month = req.params.month * 1;
  const year = req.params.year * 1;
  const docs = await Compensation.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-${getDaysInMonth(month, year)}`),
        },
        affiliate: mongoose.Types.ObjectId(req.params.id),
      },
    },
  ]);

  console.log(docs);

  res.status(200).json({
    status: 'success',
    data: {
      data: docs,
    },
  });
});
