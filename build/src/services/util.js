"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strToHex = exports.handleStorageTxWithLock = exports.sleep = exports.resHandler = exports.withApiReady = exports.queryToObj = exports.sendTx = exports.loadKeyringPair = void 0;
const keyring_1 = require("@polkadot/keyring");
const promise_timeout_1 = require("promise-timeout");
const index_1 = require("./index");
const log_1 = require("../log");
const txLocker = { storage: false };
/**
 * Public functions
 */
function loadKeyringPair(req) {
    const [backup, password] = getAccountInfo(req);
    const kr = new keyring_1.Keyring({
        type: 'sr25519',
    });
    const krp = kr.addFromJson(JSON.parse(backup));
    krp.decodePkcs8(password);
    return krp;
}
exports.loadKeyringPair = loadKeyringPair;
function sendTx(tx, krp) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            tx.signAndSend(krp, ({ events = [], status }) => {
                log_1.logger.info(`  ↪ 💸 [tx]: Transaction status: ${status.type}, nonce: ${tx.nonce}`);
                if (status.isInvalid || status.isDropped || status.isUsurped) {
                    reject(new Error(`${status.type} transaction.`));
                }
                else {
                    // Pass it
                }
                if (status.isInBlock) {
                    events.forEach(({ event: { data, method, section } }) => {
                        if (section === 'system' && method === 'ExtrinsicFailed') {
                            const [dispatchError] = data;
                            const result = {
                                status: 'failed',
                                message: dispatchError.type,
                            };
                            // Can get detail error info
                            if (dispatchError.isModule) {
                                const mod = dispatchError.asModule;
                                const error = (0, index_1.getApi)().registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));
                                result.message = `${error.section}.${error.name}`;
                                // console.log({error});
                                // args: string[];
                                // docs: string[];
                                // fields: SiField[];
                                // index: number;
                                // method: string;
                                // name: string;
                                // section: string;
                                // result.details = error.documentation.join('');
                                result.details = error.docs.join('');
                            }
                            log_1.logger.info(`  ↪ 💸 ❌ [tx]: Send transaction(${tx.type}) failed with ${result.message}.`);
                            resolve(result);
                        }
                        else if (method === 'ExtrinsicSuccess') {
                            const result = {
                                status: 'success',
                            };
                            log_1.logger.info(`  ↪ 💸 ✅ [tx]: Send transaction(${tx.type}) success.`);
                            resolve(result);
                        }
                    });
                }
                else {
                    // Pass it
                }
            }).catch(e => {
                reject(e);
            });
        });
    });
}
exports.sendTx = sendTx;
function queryToObj(queryRes) {
    return JSON.parse(JSON.stringify(queryRes));
}
exports.queryToObj = queryToObj;
function withApiReady(fn, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = (0, index_1.getApi)();
        if (!api || !api.isConnected) {
            next(new Error('⚠️  Chain is offline, please connect a running chain.'));
            return;
        }
        try {
            const matureApi = yield api.isReady;
            yield fn(matureApi);
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
exports.withApiReady = withApiReady;
function resHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const txRes = yield req;
        if (txRes && 'success' === txRes.status) {
            res.json(txRes);
        }
        else {
            res.status(400).json(txRes);
        }
    });
}
exports.resHandler = resHandler;
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
exports.sleep = sleep;
function handleStorageTxWithLock(handler) {
    return __awaiter(this, void 0, void 0, function* () {
        if (txLocker.storage) {
            return {
                status: 'failed',
                details: 'Tx Locked',
            };
        }
        try {
            txLocker.storage = true;
            return yield (0, promise_timeout_1.timeout)(new Promise((resolve, reject) => {
                handler().then(resolve).catch(reject);
            }), 7 * 60 * 1000 // 7 min, for valid till checking
            );
        }
        finally {
            txLocker.storage = false;
        }
    });
}
exports.handleStorageTxWithLock = handleStorageTxWithLock;
/**
 * Private functions
 */
function getAccountInfo(req) {
    // Get and check backup
    const backup = req.body['backup'];
    if (typeof backup !== 'string') {
        return ['', ''];
    }
    // Get and check password
    const password = req.headers['password'];
    if (typeof password !== 'string') {
        return ['', ''];
    }
    return [backup, password];
}
function strToHex(str) {
    return '0x' + Buffer.from(str).toString('hex');
}
exports.strToHex = strToHex;
