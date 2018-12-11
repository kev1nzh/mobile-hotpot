import { BaseEntity } from "../baseEntities/BaseEntity";
export class LimitSaleProduct extends BaseEntity {
    constructor() {
        super();
        this.productId = undefined;
        this.created = 0;
        this.limit = undefined;
        this.modified = 0;
        this.name = undefined;
        this.productId = undefined;
        this.sold = 0;
        this.status = undefined;
        this.storeId = 0;
    }
    GetEntityInfo() {
        return {
            Name: "LimitSaleProduct",
            Index: "ebossh",
            Type: "limitSaleProducts"
        };
    }
    ImplementsIStore() {
        return true;
    }
    ImplementsIHasModificationTime() {
        return true;
    }
    ImplementsIHasCreationTime() {
        return true;
    }
}
//# sourceMappingURL=LimitSaleProduct.js.map