"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {},
    types: {
        Lock: {
            total: 'Compact<Balance>',
            last_unlock_at: 'BlockNumber',
            lock_type: 'LockType',
        },
        LockType: {
            delay: 'BlockNumber',
            lock_period: 'u32',
        },
    },
};
