"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const log_1 = require("./log");
const services = __importStar(require("./services"));
const bodyParser = __importStar(require("body-parser"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const app = (0, express_1.default)();
const PORT = process.argv[2] || 56666;
const maxErrorHandlingCount = 10;
let errorHandlingCount = 0;
const errorHandler = (err, _req, res, _next) => {
    const errMsg = '' + err ? err.message : 'Unknown error';
    log_1.logger.error(`☄️ [global]: Error catched: ${errMsg}.`);
    if (res) {
        res.status(400).send({
            status: 'error',
            message: errMsg,
        });
    }
    services.initApi();
    log_1.logger.warn('📡 [global]: Connection reinitialized.');
};
const loggingResponse = (_, res, next) => {
    const send = res.send;
    res.send = function (...args) {
        if (args.length > 0) {
            log_1.logger.info(`  ↪ [${res.statusCode}]: ${args[0]}`);
        }
        send.call(res, ...args);
    };
    next();
};
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(loggingResponse);
// API timeout handler
app.use((0, connect_timeout_1.default)('600s'));
// Get routes
app.get('/api/v1/block/header', services.chain.header);
app.get('/api/v1/block/hash', services.chain.blockHash);
app.get('/api/v1/system/health', services.chain.health);
app.get('/api/v1/swork/workreport', services.swork.workReport);
app.get('/api/v1/swork/code', services.swork.code);
app.get('/api/v1/swork/identity', services.swork.identity);
app.get('/api/v1/market/file', services.market.file);
// Post routes
app.post('/api/v1/swork/identity', services.swork.register);
app.post('/api/v1/swork/workreport', services.swork.reportWorks);
// Error handler
app.use(errorHandler);
process.on('uncaughtException', (err) => {
    log_1.logger.error(`☄️ [global] Uncaught exception ${err.message}`);
    if (++errorHandlingCount <= maxErrorHandlingCount) {
        errorHandler(err, null, null, null);
    }
    else {
        log_1.logger.error('Reach max error handling count, just exit and waitinng for restart');
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
});
app.listen(PORT, () => {
    log_1.logger.info(`⚡️ [global]: Crust API is running at https://localhost:${PORT}`);
});
