const dotenv = require('dotenv');
const mongoose = require('mongoose');

//To catch synchronous errors
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception shutting down...');
  console.log(err.name, err.msg, err.stack);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });
const DBstring =
  'mongodb+srv://aranyak:<PASSWORD>@cluster0.8pwvr.mongodb.net/adventours?retryWrites=true&w=majority';
const DB = DBstring.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`app started on port ${port}...`);
});

//To catch asynchronous errors
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection shutting down...');
  console.log(err);
  //Server.close handles all pending requests or responses
  // and then process.exit() closes the server
  server.close(() => {
    process.exit(1);
  });
});
