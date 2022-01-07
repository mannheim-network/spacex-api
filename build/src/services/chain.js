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
exports.health = exports.blockHash = exports.header = void 0;
const log_1 = require("../log");
const util_1 = require("./util");
function header(api) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info('⛓ [chain]: Query chain header');
        return api.rpc.chain.getHeader();
    });
}
exports.header = header;
function blockHash(api, bn) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info(`⛓ [chain]: Query block hash with ${bn}`);
        return api.query.system.blockHash(bn);
    });
}
exports.blockHash = blockHash;
function health(api) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info('⛓ [chain]: Query system health');
        const h = yield api.rpc.system.health();
        const ch = {
            isSyncing: h.isSyncing.isTrue,
            peers: h.peers.toNumber(),
            shouldHavePeers: h.shouldHavePeers.isTrue,
        };
        // HEALTH PATCH: This is for the poor syncing process
        if (!ch.isSyncing) {
            const h_before = yield header(api);
            yield (0, util_1.sleep)(3000);
            const h_after = yield header(api);
            if (h_before.number.toNumber() + 1 < h_after.number.toNumber()) {
                ch.isSyncing = true;
            }
        }
        return ch;
    });
}
exports.health = health;
