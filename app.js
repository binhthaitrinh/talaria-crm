const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const itemRouter = require('./routes/itemRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const accountRouter = require('./routes/accountRoutes');
const paxfulRouter = require('./routes/paxfulRoutes');
const giftCardRouter = require('./routes/giftCardRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser middleware
app.use(express.json());

// parse data from URL encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/items', itemRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/paxfuls', paxfulRouter);
app.use('/api/v1/giftcards', giftCardRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
