const express = require('express');
const counterModel = require('../models/counterModel');
const catchAsync = require('../utils/catchAsync');

const counterRouter = express.Router();

counterRouter
  .route('/')
  .post(
    catchAsync(async (req, res) => {
      const doc = await counterModel.create(req.body);

      return res.status(201).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    })
  )
  .get(
    catchAsync(async (req, res) => {
      const docs = await counterModel.find();

      return res.status(200).json({ status: 'success', data: { data: docs } });
    })
  );

module.exports = counterRouter;
