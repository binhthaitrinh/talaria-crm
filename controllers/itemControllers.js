const Item = require('../models/itemModel');

exports.getAllItems = (req, res, next) => {};

exports.createItem = async (req, res, next) => {
  console.log('creating...');
  try {
    const item = await Item.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: item,
      },
    });
    console.log('done');
  } catch (err) {
    console.log(err);
  }
};
