require('zv-load.env')();
const mongoose = require('mongoose');
const { uncaughtExceptionHandler, unhandledRejectionHandler } = require('zv-express-error-handler');

uncaughtExceptionHandler();

const app = require('./app');

// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB,
{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8888;
const server = app.listen(port, () => console.log(`App running on port ${port}...`));

unhandledRejectionHandler(server);