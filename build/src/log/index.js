"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.format.colorize(), winston_1.format.errors({ stack: true }), winston_1.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [
        //
        // - Write to all logs with level `info` and below to `spacex-api-combined.log`.
        // - Write all logs error (and below) to `spacex-api-error.log`.
        //
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'spacex-api-error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'spacex-api-combined.log' }),
    ],
});
