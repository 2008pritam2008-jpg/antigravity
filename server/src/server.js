// server/src/server.js
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`AgriAssist API Server listening on port ${PORT} [Environment: ${env.NODE_ENV}]`);
  logger.info(`Health check endpoint available at: http://localhost:${PORT}/api/v1/health`);
});

// Graceful Process Termination
const handleShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default server;
