import { FullAuditEntity } from "../baseEntities/BaseEntity";
export class CustomPayment extends FullAuditEntity {
    constructor() {
        super();
        this.payType = undefined;
        this.payType = undefined;
        this.name = undefined;
        this.isFlagPay = undefined;
        this.isTop = undefined;
        this.isTuan = undefined;
        this.status = undefined;
        this.isUsed = undefined;
        this.isEnabled = undefined;
        this.created = undefined;
        this.modified = undefined;
    }
    GetEntityInfo() {
        return {
            Name: "CustomPayment",
            Index: "ebossh",
            Type: "custompaymenttype"
        };
    }
}
//# sourceMappingURL=CustomPayment.js.map