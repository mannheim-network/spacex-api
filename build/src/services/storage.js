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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.code = exports.workReport = exports.identity = exports.reportWorks = exports.register = void 0;
const util_1 = require("./util");
const log_1 = require("../log");
const lodash_1 = __importDefault(require("lodash"));
/**
 * Send extrinsics
 */
function register(api, krp, req) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info(`⚙️ [storage]: Call register with ${JSON.stringify(req.body)}`);
        const tx = api.tx.storage.register(req.body['ias_sig'], req.body['ias_cert'], req.body['account_id'], req.body['isv_body'], '0x' + req.body['sig']);
        return (0, util_1.handleStorageTxWithLock)(() => __awaiter(this, void 0, void 0, function* () { return (0, util_1.sendTx)(tx, krp); }));
    });
}
exports.register = register;
function reportWorks(api, krp, req) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info(`⚙️ [storage]: Call report works with ${JSON.stringify(req.body)}`);
        const slot = Number(req.body['block_height']);
        const pk = '0x' + req.body['pub_key'];
        const fileParser = (file) => {
            const rst = [
                (0, util_1.strToHex)(file.cid),
                file.size,
                file.c_block_num,
            ];
            return rst;
        };
        const tx = api.tx.storage.reportWorks(pk, '0x' + req.body['pre_pub_key'], slot, '0x' + req.body['block_hash'], req.body['reserved'], req.body['files_size'], req.body['added_files'].map(fileParser), req.body['deleted_files'].map(fileParser), '0x' + req.body['reserved_root'], '0x' + req.body['files_root'], '0x' + req.body['sig']);
        let txRes = (0, util_1.queryToObj)(yield (0, util_1.handleStorageTxWithLock)(() => __awaiter(this, void 0, void 0, function* () { return (0, util_1.sendTx)(tx, krp); })));
        // Double confirm of tx status
        txRes = txRes ? txRes : {};
        // 1. Query anchor
        let isReported = false;
        const pkInfo = (0, util_1.queryToObj)(yield api.query.storage.pubKeys(pk));
        const anchor = pkInfo.anchor;
        // 2. Query work report
        if (anchor) {
            isReported = (0, util_1.queryToObj)(yield api.query.storage.reportedInSlot(anchor, slot));
        }
        // 3. ⚠️ WARNING: inblocked but not recorded
        if (!isReported) {
            log_1.logger.warn(`  ↪ ⚙️ [storage]: report works invalid in slot=${slot} with pk=${pk}`);
            txRes.status = 'failed';
            txRes.details = `${txRes.details} and report work not in block.`;
        }
        else {
            txRes.status = 'success';
        }
        return txRes;
    });
}
exports.reportWorks = reportWorks;
/**
 * Queries
 */
function identity(api, addr) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info(`⚙️ [storage]: Query identity with ${addr}`);
        return yield api.query.storage.identities(addr);
    });
}
exports.identity = identity;
function workReport(api, addr) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info(`⚙️ [storage]: Query work report with ${addr}`);
        // Get anchor
        const id = (0, util_1.queryToObj)(yield identity(api, addr));
        const anchor = id.anchor;
        return yield api.query.storage.workReports(anchor);
    });
}
exports.workReport = workReport;
function code(api) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info('⚙️ [storage]: Query storager code');
        const codes = yield api.query.storage.codes.entries();
        return lodash_1.default.map(codes, ([{ args: [code], }, value,]) => {
            const expired_on = (0, util_1.queryToObj)(value);
            return {
                code: code.toString(),
                expired_on,
            };
        });
    });
}
exports.code = code;
