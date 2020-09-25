const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Please log in again', 401);

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  console.log(value);
  const message = `Duplicate field value : ${value}.Please enter another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErr = (err, res, req) => {
  console.log(err);
  //Api
  if (req.originalUrl.startsWith('/api')) {
    //Operational errors i.e known errors
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //Unknown errors
      console.error('Error ', err);
      res.status(err.statusCode).json({
        status: err.status,
        message: 'Something went wrong!...',
      });
    }
  } else {
    //Rendered website
    if (err.isOperational) {
      console.log(err, 'within operationsal');
      return res.status(err.statusCode).render('error', {
        title: 'something went wrong!',
        msg: err.message,
      });
    }
    //Unknown errors
    return res.status(err.statusCode).render('error', {
      title: 'something went wrong!',
      msg: 'Please try again later',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = { ...err };
  error.message = err.message;
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error._message === 'Tour validation failed')
    error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')
    error = handleJWTError();
  console.log(error);
  sendErr(error, res, req);
};
