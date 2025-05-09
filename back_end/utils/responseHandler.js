// utils/responseHandler.js
const AppError = require('./appError');

class ResponseHandler {
  static sendSuccess(res, options = {}) {
    const {
      statusCode = 200,
      message = 'Operation successful',
      data = null,
      meta,
    } = options;

    const response = {
      status: 'success',
      message,
    };

    if (data) response.data = data;
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  static sendError(next, options = {}) {
    const {
      statusCode = 500,
      message = 'Something went wrong',
      isOperational = true,
    } = options;

    return next(new AppError(message, statusCode, isOperational));
  }
}

module.exports = ResponseHandler;
