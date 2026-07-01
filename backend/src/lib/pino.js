import pino from 'pino';
import { config } from '../config/env.js';

const isDev = config.nodeEnv === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.passwordConfirm',
      'req.body.token',
      'res.headers["set-cookie"]'
    ],
    placeholder: '[REDACTED]'
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});
