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
exports.market = exports.storage = exports.chain = exports.getApi = exports.initApi = void 0;
const api_1 = require("@polkadot/api");
const type_definitions_1 = require("@crustio/type-definitions");
const chain_1 = require("./chain");
const storage_1 = require("./storage");
const market_1 = require("./market");
const util_1 = require("./util");
const log_1 = require("../log");
let api = newApiPromise();
const initApi = () => {
    if (api && api.disconnect) {
        log_1.logger.info('⚠️  Disconnecting from old api...');
        api
            .disconnect()
            .then(() => { })
            .catch(() => { });
    }
    api = newApiPromise();
    api.isReady.then(api => {
        log_1.logger.info(`⚡️ [global] Current chain info: ${api.runtimeChain}, ${api.runtimeVersion}`);
    });
};
exports.initApi = initApi;
const getApi = () => {
    return api;
};
exports.getApi = getApi;
exports.chain = {
    header: (_, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            const h = yield (0, chain_1.header)(api);
            res.json({
                number: h.number,
                hash: h.hash,
            });
        }), next);
    },
    blockHash: (req, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            res.send(yield (0, chain_1.blockHash)(api, Number(req.query['blockNumber'])));
        }), next);
    },
    health: (_, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            res.json(yield (0, chain_1.health)(api));
        }), next);
    },
};
exports.storage = {
    register: (req, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            const krp = (0, util_1.loadKeyringPair)(req);
            yield (0, util_1.resHandler)((0, storage_1.register)(api, krp, req), res);
        }), next);
    },
    reportWorks: (req, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            const krp = (0, util_1.loadKeyringPair)(req);
            yield (0, util_1.resHandler)((0, storage_1.reportWorks)(api, krp, req), res);
        }), next);
    },
    identity: (req, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            res.json(yield (0, storage_1.identity)(api, String(req.query['address'])));
        }), next);
    },
    workReport: (req, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            res.json(yield (0, storage_1.workReport)(api, String(req.query['address'])));
        }), next);
    },
    code: (_, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            res.json(yield (0, storage_1.code)(api));
        }), next);
    },
};
exports.market = {
    file: (req, res, next) => {
        (0, util_1.withApiReady)((api) => __awaiter(void 0, void 0, void 0, function* () {
            res.json(yield (0, market_1.file)(api, String(req.query['cid'])));
        }), next);
    },
};
function newApiPromise() {
    return new api_1.ApiPromise({
        provider: new api_1.WsProvider(process.argv[3] || 'ws://localhost:9944'),
        typesBundle: type_definitions_1.typesBundleForPolkadot,
    });
}
