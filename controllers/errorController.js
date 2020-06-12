const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  console.log(err.name);
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    const error = new AppError(message, 400);
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  console.log(req.originalUrl);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};
