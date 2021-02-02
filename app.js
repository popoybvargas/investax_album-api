const express = require('express');
const morgan = require('morgan');
const { invalidRoutesHandler, globalErrorHandler } = require('zv-express-error-handler');

const photosRouter = require('./routes/photosRoutes');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// ROUTES
app.get('/health', (req, res) => res.status(200).json({ message: 'OK' }));
app.use('/photos', photosRouter);
// INVALID ROUTES
app.all('*', invalidRoutesHandler);
app.use(globalErrorHandler);

module.exports = app;