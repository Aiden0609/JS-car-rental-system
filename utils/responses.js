const createError = require('http-errors');

function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message: message,
    data: data,
  });
}

function failure(res, error) {
  let statusCode;
  let errors;

  if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    errors = error.errors.map((e) => e.message);
  } else if (error instanceof createError.HttpError) {
    statusCode = error.status;
    errors = error.message;
  } else {
    statusCode = 500;
    errors = 'Internal Server Error';
  }

  res.status(statusCode).json({
    status: false,
    message: `Request fail: ${error.name}`,
    errors: Array.isArray(errors) ? errors : [errors],
  });
}

module.exports = {
  success,
  failure,
};
