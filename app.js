/* Express application entry: assemble middleware, static files and business routers */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/* Business routers */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const carsRouter = require('./routes/cars');
const customersRouter = require('./routes/customers');
const rentalsRouter = require('./routes/rentals');

const app = express();

/* Global middleware: request logging, JSON & urlencoded parsing, cookies, static files */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Mount business routers (users is a scaffold placeholder) */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cars', carsRouter);
app.use('/customers', customersRouter);
app.use('/rentals', rentalsRouter);

module.exports = app;
