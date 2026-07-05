import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGS_DIR  = join(__dirname, '../../logs');

// Ensure the logs directory exists before Winston tries to write to it
try {
  mkdirSync(LOGS_DIR, { recursive: true });
} catch {
  // Directory already exists — safe to ignore
}

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = printf(({ level, message, timestamp: ts, stack }) =>
  `${ts} [${level}]: ${stack || message}`
);

const fileRotateTransport = new DailyRotateFile({
  filename: join(LOGS_DIR, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  format: combine(timestamp(), errors({ stack: true }), json()),
});

const errorFileRotateTransport = new DailyRotateFile({
  filename: join(LOGS_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '30d',
  maxSize: '20m',
  format: combine(timestamp(), errors({ stack: true }), json()),
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'cinestream-api' },
  transports:
    process.env.NODE_ENV === 'production'
      ? [fileRotateTransport, errorFileRotateTransport]
      : [
          new winston.transports.Console({
            format: combine(
              colorize({ all: true }),
              timestamp({ format: 'HH:mm:ss' }),
              errors({ stack: true }),
              devFormat
            ),
          }),
        ],
});
