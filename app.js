const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser middleware
app.use(express.json());

// parse data from URL encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/api/v1/items', (req, res) => console.log('connect to items api...'));

module.exports = app;
