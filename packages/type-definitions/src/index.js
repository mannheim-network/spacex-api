"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typesBundleForPolkadot = exports.typesAlias = exports.rpc = exports.types = exports.spacexTypes = void 0;
const base_1 = __importDefault(require("./base"));
const benefit_1 = __importDefault(require("./benefit"));
const claims_1 = __importDefault(require("./claims"));
const utils_1 = require("@open-web3/orml-type-definitions/utils");
const locks_1 = __importDefault(require("./locks"));
const market_1 = __importDefault(require("./market"));
const staking_1 = __importDefault(require("./staking"));
const storage_1 = __importDefault(require("./storage"));
exports.spacexTypes = {
    base: base_1.default,
    benefit: benefit_1.default,
    claims: claims_1.default,
    locks: locks_1.default,
    market: market_1.default,
    staking: staking_1.default,
    storage: storage_1.default,
};
exports.types = Object.assign({}, utils_1.typesFromDefs(exports.spacexTypes));
exports.rpc = utils_1.jsonrpcFromDefs(exports.spacexTypes);
exports.typesAlias = utils_1.typesAliasFromDefs(exports.spacexTypes);
const bundle = {
    rpc: exports.rpc,
    types: [
        {
            minmax: [undefined, undefined],
            types: Object.assign({}, exports.types),
        },
    ],
    alias: exports.typesAlias,
};
// Type overrides have priority issues
exports.typesBundleForPolkadot = {
    spec: {
        spacex: bundle,
    },
};
