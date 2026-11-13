// server/src/utils/logger.js

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = process.env.LOG_LEVEL || 'info';

const shouldLog = (level) => {
  return (LOG_LEVELS[level] ?? 2) <= (LOG_LEVELS[currentLevel] ?? 2);
};

export const logger = {
  info: (message, meta = {}) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
    }
  },
  warn: (message, meta = {}) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
    }
  },
  error: (message, error = {}) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error?.message || error);
    }
  },
  debug: (message, meta = {}) => {
    if (shouldLog('debug')) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
    }
  },
};
