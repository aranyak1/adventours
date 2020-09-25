const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

//express is a fn here so calling it will add a bunch of methods to app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) Middlewares

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Helmet middleware(sets security http headers)
app.use(helmet());

//Rate limiter middleware
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too much requests from this IP,please try again in an hour!',
});

app.use('/api', limiter);

//adds body to requests i.e req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against nosql query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(
  xss({
    whiteList: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//middleware to prevent http parameter pollutin
app.use(hpp());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log(' hello from middleware ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('cookie ', req.cookies.jwt);
  next();
});

// 2) Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server`));
});

app.use(globalErrorHandler);

module.exports = app;
