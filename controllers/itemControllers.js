const mongoose = require('mongoose');
const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllItems = catchAsync(async (req, res, next) => {
  const items = await Item.find();

  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      data: items,
    },
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const item = await Item.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      data: item,
    },
  });
});

exports.chargeMoney = catchAsync(async (req, res, next) => {
  // const item = await Item.findById(req.params.id);

  // const transaction = await item.createTransaction();

  // const item = await Item.aggregate([
  //   {
  //     $match: { _id: mongoose.Types.ObjectId(req.params.id) },
  //   },
  //   {
  //     $project: {
  //       total: {
  //         // $add: ['$tax', '$usShippingFee', '$quantity', '$pricePerItem'],
  //         $add: [
  //           '$usShippingFee',
  //           {
  //             $multiply: ['$quantity', '$pricePerItem', { $add: [1, '$tax'] }],
  //           },
  //         ],
  //       },
  //     },
  //   },
  // ]);

  const transaction = await Item.createTransaction(req.params.id);

  // console.log(parseFloat(item[0].total));

  res.status(200).json({
    status: 'success',
    data: {
      data: transaction,
    },
  });
});
