import { Request, Response, NextFunction } from 'express';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@spacex/type-definitions';
import { blockHash, header, health } from './chain';
import { register, reportWorks, workReport, code, identity } from './storage';
import { file } from './market';
import { loadKeyringPair, resHandler, withApiReady } from './util';
import { logger } from '../log';

// TODO: Better result
export interface TxRes {
  status?: string;
  message?: string;
  details?: string;
}

let api: ApiPromise = newApiPromise();

export const initApi = () => {
  if (api && api.disconnect) {
    logger.info('⚠️  Disconnecting from old api...');
    api
      .disconnect()
      .then(() => { })
      .catch(() => { });
  }
  api = newApiPromise();
  api.isReady.then(api => {
    logger.info(
      `⚡️ [global] Current chain info: ${api.runtimeChain}, ${api.runtimeVersion}`
    );
  });
};

export const getApi = (): ApiPromise => {
  return api;
};

export const chain = {
  header: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const h = await header(api);
      res.json({
        number: h.number,
        hash: h.hash,
      });
    }, next);
  },
  blockHash: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.send(await blockHash(api, Number(req.query['blockNumber'])));
    }, next);
  },
  health: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await health(api));
    }, next);
  },
};

export const storage = {
  register: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      await resHandler(register(api, krp, req), res);
    }, next);
  },
  reportWorks: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      await resHandler(reportWorks(api, krp, req), res);
    }, next);
  },
  identity: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await identity(api, String(req.query['address'])));
    }, next);
  },
  workReport: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await workReport(api, String(req.query['address'])));
    }, next);
  },
  code: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await code(api));
    }, next);
  },
};

export const market = {
  file: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await file(api, String(req.query['cid'])));
    }, next);
  },
};

function newApiPromise(): ApiPromise {
  return new ApiPromise({
    provider: new WsProvider(process.argv[3] || 'ws://localhost:9944'),
    typesBundle: typesBundleForPolkadot,
  });
}
