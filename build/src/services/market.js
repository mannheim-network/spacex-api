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
exports.file = void 0;
const util_1 = require("./util");
const log_1 = require("../log");
// Queries
function file(api, cid) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.logger.info(`📦 [market]: Query file order with cid: ${cid}`);
        const [fileInfo, _usedInfo] = (0, util_1.queryToObj)(yield api.query.market.files(cid));
        return fileInfo;
    });
}
exports.file = file;
