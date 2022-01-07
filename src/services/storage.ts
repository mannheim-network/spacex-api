/* eslint-disable node/no-extraneous-import */
import { ApiPromise } from '@polkadot/api';
import { Request } from 'express';
import { KeyringPair } from '@polkadot/keyring/types';
import { sendTx, queryToObj, strToHex, handleStorageTxWithLock } from './util';
import { logger } from '../log';
import lodash from 'lodash';

/**
 * Send extrinsics
 */
export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(`⚙️ [storage]: Call register with ${JSON.stringify(req.body)}`);
  const tx = api.tx.storage.register(
    req.body['ias_sig'],
    req.body['ias_cert'],
    req.body['account_id'],
    req.body['isv_body'],
    '0x' + req.body['sig']
  );

  return handleStorageTxWithLock(async () => sendTx(tx, krp));
}

export async function reportWorks(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(`⚙️ [storage]: Call report works with ${JSON.stringify(req.body)}`);
  const slot = Number(req.body['block_height']);
  const pk = '0x' + req.body['pub_key'];
  const fileParser = (file: any) => {
    const rst: [string, number, number] = [
      strToHex(file.cid),
      file.size,
      file.c_block_num,
    ];
    return rst;
  };
  const tx = api.tx.storage.reportWorks(
    pk,
    '0x' + req.body['pre_pub_key'],
    slot,
    '0x' + req.body['block_hash'],
    req.body['reserved'],
    req.body['files_size'],
    req.body['added_files'].map(fileParser),
    req.body['deleted_files'].map(fileParser),
    '0x' + req.body['reserved_root'],
    '0x' + req.body['files_root'],
    '0x' + req.body['sig']
  );

  let txRes = queryToObj(
    await handleStorageTxWithLock(async () => sendTx(tx, krp))
  );

  // Double confirm of tx status
  txRes = txRes ? txRes : {};
  // 1. Query anchor
  let isReported = false;
  const pkInfo = queryToObj(await api.query.storage.pubKeys(pk));
  const anchor = pkInfo.anchor;

  // 2. Query work report
  if (anchor) {
    isReported = queryToObj(await api.query.storage.reportedInSlot(anchor, slot));
  }

  // 3. ⚠️ WARNING: inblocked but not recorded
  if (!isReported) {
    logger.warn(
      `  ↪ ⚙️ [storage]: report works invalid in slot=${slot} with pk=${pk}`
    );
    txRes.status = 'failed';
    txRes.details = `${txRes.details} and report work not in block.`;
  } else {
    txRes.status = 'success';
  }

  return txRes;
}

/**
 * Queries
 */
export async function identity(api: ApiPromise, addr: string) {
  logger.info(`⚙️ [storage]: Query identity with ${addr}`);

  return await api.query.storage.identities(addr);
}

export async function workReport(api: ApiPromise, addr: string) {
  logger.info(`⚙️ [storage]: Query work report with ${addr}`);

  // Get anchor
  const id = queryToObj(await identity(api, addr));
  const anchor = id.anchor;

  return await api.query.storage.workReports(anchor);
}

export async function code(api: ApiPromise) {
  logger.info('⚙️ [storage]: Query storager code');
  const codes = await api.query.storage.codes.entries();
  return lodash.map(
    codes,
    ([
      {
        args: [code],
      },
      value,
    ]) => {
      const expired_on = queryToObj(value);
      return {
        code: code.toString(),
        expired_on,
      };
    }
  );
}
