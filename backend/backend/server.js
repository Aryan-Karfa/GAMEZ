import 'dotenv/config';
import { config } from './src/config/env.js';
import { logger } from './src/lib/pino.js';
import prisma from './src/lib/prisma.js';

const { default: app } = await import('./src/app.js');

const server = app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, 'Server starting up and listening');
});

// Graceful Shutdown Logic
const shutdown = async (signal) => {
  logger.warn({ signal }, 'Termination signal received. Booting shutdown sequence...');
  
  server.close(async () => {
    logger.info('HTTP Server connection pool closed.');
    
    try {
      await prisma.$disconnect();
      logger.info('Database client disconnected successfully.');
      process.exit(0);
    } catch (err) {
      logger.error({ error: err.message }, 'Error disconnecting database client.');
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Shutdown sequence timed out. Force exiting...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
