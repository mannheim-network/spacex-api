import express, {NextFunction} from 'express';
import {Request, Response} from 'express';
import {logger} from './log';
import * as services from './services';
import * as bodyParser from 'body-parser';
import timeout from 'connect-timeout';

const app = express();
const PORT = process.argv[2] || 56666;
const maxErrorHandlingCount = 10;
let errorHandlingCount = 0;

const errorHandler = (
  err: any,
  _req: Request | null,
  res: Response | null,
  _next: any
) => {
  const errMsg: string = '' + err ? err.message : 'Unknown error';
  logger.error(`☄️ [global]: Error catched: ${errMsg}.`);
  if (res) {
    res.status(400).send({
      status: 'error',
      message: errMsg,
    });
  }

  services.initApi();
  logger.warn('📡 [global]: Connection reinitialized.');
};

const loggingResponse = (_: Request, res: Response, next: NextFunction) => {
  const send = res.send;
  res.send = function (...args: any) {
    if (args.length > 0) {
      logger.info(`  ↪ [${res.statusCode}]: ${args[0]}`);
    }
    send.call(res, ...args);
  } as any;
  next();
};

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use(loggingResponse);

// API timeout handler
app.use(timeout('600s'));

// Get routes
app.get('/api/v1/block/header', services.chain.header);
app.get('/api/v1/block/hash', services.chain.blockHash);
app.get('/api/v1/system/health', services.chain.health);
app.get('/api/v1/storage/workreport', services.storage.workReport);
app.get('/api/v1/storage/code', services.storage.code);
app.get('/api/v1/storage/identity', services.storage.identity);
app.get('/api/v1/market/file', services.market.file);

// Post routes
app.post('/api/v1/storage/identity', services.storage.register);
app.post('/api/v1/storage/workreport', services.storage.reportWorks);

// Error handler
app.use(errorHandler);
process.on('uncaughtException', (err: Error) => {
  logger.error(`☄️ [global] Uncaught exception ${err.message}`);
  if (++errorHandlingCount <= maxErrorHandlingCount) {
    errorHandler(err, null, null, null);
  } else {
    logger.error(
      'Reach max error handling count, just exit and waitinng for restart'
    );
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
});

app.listen(PORT, () => {
  logger.info(
    `⚡️ [global]: SpaceX API is running at http://localhost:${PORT}`
  );
});
