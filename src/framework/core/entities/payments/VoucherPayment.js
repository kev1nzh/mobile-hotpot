import { FullAuditEntity } from "../baseEntities/BaseEntity";
export class VoucherPayment extends FullAuditEntity {
    GetEntityInfo() {
        return {
            Name: "VoucherPayment",
            Index: "ebossh",
            Type: "thirdPartyVouchers"
        };
    }
}
//# sourceMappingURL=VoucherPayment.js.map