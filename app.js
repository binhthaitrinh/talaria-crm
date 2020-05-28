const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const itemRouter = require('./routes/itemRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser middleware
app.use(express.json());

// parse data from URL encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/items', itemRouter);

module.exports = app;
