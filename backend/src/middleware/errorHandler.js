import { APIError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Error:', err);
  }

  // Handle known API errors
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  // Handle unknown errors (500 Internal Server Error)
  res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message
  });
};
