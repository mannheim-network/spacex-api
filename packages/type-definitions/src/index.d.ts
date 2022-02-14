export declare const spacexTypes: {
    base: {
        rpc: {};
        types: {
            AccountInfo: string;
            Address: string;
            AddressInfo: string;
            LookupSource: string;
        };
    };
    benefit: {
        rpc: {};
        types: {
            EraBenefits: {
                total_fee_reduction_quota: string;
                total_market_active_funds: string;
                used_fee_reduction_quota: string;
                active_era: string;
            };
            FundsType: {
                _enum: string[];
            };
            FundsUnlockChunk: {
                value: string;
                era: string;
            };
            MarketBenefit: {
                total_funds: string;
                active_funds: string;
                used_fee_reduction_quota: string;
                file_reward: string;
                refreshed_at: string;
                unlocking_funds: string;
            };
            SworkBenefit: {
                total_funds: string;
                active_funds: string;
                total_fee_reduction_count: string;
                used_fee_reduction_count: string;
                refreshed_at: string;
                unlocking_funds: string;
            };
        };
    };
    claims: {
        rpc: {};
        types: {
            ETHAddress: string;
            EthereumTxHash: string;
        };
    };
    locks: {
        rpc: {};
        types: {
            Lock: {
                total: string;
                last_unlock_at: string;
                lock_type: string;
            };
            LockType: {
                delay: string;
                lock_period: string;
            };
        };
    };
    market: {
        rpc: {};
        types: {
            FileInfo: {
                file_size: string;
                spower: string;
                expired_at: string;
                calculated_at: string;
                amount: string;
                prepaid: string;
                reported_replica_count: string;
                replicas: string;
            };
            Replica: {
                who: string;
                valid_at: string;
                anchor: string;
                is_reported: string;
                created_at: string;
            };
        };
    };
    staking: {
        rpc: {};
        types: {
            Guarantee: {
                targets: string;
                total: string;
                submitted_in: string;
                suppressed: string;
            };
            ValidatorPrefs: {
                guarantee_fee: string;
            };
        };
    };
    spacex: {
        rpc: {};
        types: {
            Group: {
                members: string;
                allowlist: string;
            };
            IASSig: string;
            Identity: {
                anchor: string;
                punishment_deadline: string;
                group: string;
            };
            ISVBody: string;
            MerkleRoot: string;
            ReportSlot: string;
            PKInfo: {
                code: string;
                anchor: string;
            };
            SworkerAnchor: string;
            SworkerCert: string;
            SworkerCode: string;
            SworkerPubKey: string;
            SworkerSignature: string;
            WorkReport: {
                report_slot: string;
                spower: string;
                free: string;
                reported_files_size: string;
                reported_srd_root: string;
                reported_files_root: string;
            };
        };
    };
};
export declare const types: {
    [x: string]: any;
};
export declare const rpc: Record<string, Record<string, any>>;
export declare const typesAlias: Record<string, any>;
export declare const typesBundleForPolkadot: {
    spec: {
        spacex: {
            rpc: Record<string, Record<string, any>>;
            types: {
                minmax: any;
                types: {
                    [x: string]: any;
                };
            }[];
            alias: Record<string, any>;
        };
    };
};
