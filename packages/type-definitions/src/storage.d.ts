declare const _default: {
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
export default _default;
