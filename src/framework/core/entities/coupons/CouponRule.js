import { BaseEntity } from "../baseEntities/BaseEntity";
export class CouponRule extends BaseEntity {
    constructor() {
        super();
        this.canuseboth = true;
        this.ordercouponrules = {
            limited: false,
            count: 0
        };
        this.productcouponrules = {
            limited: false,
            count: 0
        };
    }
    GetEntityInfo() {
        return {
            Name: "CouponRule",
            Index: "ebossh",
            Type: "couponrules"
        };
    }
}
//# sourceMappingURL=CouponRule.js.map