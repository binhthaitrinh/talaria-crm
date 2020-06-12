const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const itemRouter = require('./routes/itemRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const accountRouter = require('./routes/accountRoutes');
const paxfulRouter = require('./routes/paxfulRoutes');
const giftCardRouter = require('./routes/giftCardRoutes');
const customerRouter = require('./routes/customerRoutes');
const affiliateRouter = require('./routes/affiliateRoutes');
const billRouter = require('./routes/billRoutes');
const manageRouter = require('./routes/manageRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(express.json());

// parse data from URL encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/items', itemRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/paxfuls', paxfulRouter);
app.use('/api/v1/giftcards', giftCardRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/affiliates', affiliateRouter);
app.use('/api/v1/bills', billRouter);
app.use('/api/v1/manage', manageRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
