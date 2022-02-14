declare const _default: {
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
export default _default;
