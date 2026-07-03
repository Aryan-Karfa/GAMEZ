import { formatError } from '../utils/formatResponse.js';
import { logger } from '../lib/pino.js';
import { config } from '../config/env.js';

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const requestId = req.requestId || 'UNKNOWN';
  
  // Clean message for production clients if it is a 500 error
  let clientMessage = err.message || 'Internal Server Error';
  if (config.nodeEnv === 'production' && statusCode === 500) {
    clientMessage = 'An unexpected server telemetry failure occurred.';
  }

  // Structured logging of error
  logger.error({
    requestId,
    statusCode,
    message: err.message,
    stack: err.stack
  }, 'Request error encountered');

  res.status(statusCode).json({
    ...formatError(clientMessage),
    requestId
  });
};

export default errorMiddleware;
