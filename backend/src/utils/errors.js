/**
 * Custom Error Classes for REST API
 *
 * Day 7 - Error Handling
 * - ValidationError: 400 Bad Request (invalid input)
 * - NotFoundError: 404 Not Found (resource doesn't exist)
 * - Future: AuthenticationError, AuthorizationError (Day 9+)
 */

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error(`[${err.name}] ${err.message}`);

  // Default to 500 if no status code set
  const statusCode = err.statusCode || 500;

  // Build error response
  const response = {
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred'
  };

  // Include validation errors if present
  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors;
  }

  // Don't leak stack traces in production
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
