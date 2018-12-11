import { BaseEntity } from "../baseEntities/BaseEntity";
export class RefundProduct extends BaseEntity {
    constructor() {
        super();
        this.ordersId = undefined;
        this.productId = undefined;
        this.isRefund = 0;
        this.amount = 0;
        this.created = 0;
        this.name = undefined;
        this.reasonId = undefined;
        this.refundAmount = undefined;
        this.storeId = undefined;
    }
    GetEntityInfo() {
        return {
            Name: "RefundProduct",
            Index: "ebossh",
            Type: "productsRefunds"
        };
    }
    ImplementsIStore() {
        return true;
    }
}
//# sourceMappingURL=RefundProduct.js.map