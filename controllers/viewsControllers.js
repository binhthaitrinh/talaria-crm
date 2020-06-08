const catchAsync = require('../utils/catchAsync');
const Item = require('../models/itemModel');

exports.getItems = catchAsync(async (req, res, next) => {
  const items = await Item.find().sort({ createdAt: -1 });

  console.log(items);

  res.status(200).render('items', {
    title: 'All items',
    items,
  });
});
