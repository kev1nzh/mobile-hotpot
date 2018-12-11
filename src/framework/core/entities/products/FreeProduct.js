import { BaseEntity } from "../baseEntities/BaseEntity";
export class FreeProduct extends BaseEntity {
    constructor() {
        super();
        this.ordersId = undefined;
        this.productId = undefined;
        this.cnt = 0;
        this.detailId = undefined;
        this.created = 0;
        this.name = undefined;
        this.reasonId = undefined;
        this.status = 0;
        this.storeId = undefined;
        this.amount = 0;
    }
    GetEntityInfo() {
        return {
            Name: "FreeProduct",
            Index: "ebossh",
            Type: "freeProducts"
        };
    }
    ImplementsIStore() {
        return true;
    }
}
//# sourceMappingURL=FreeProduct.js.map