import { BaseEntity } from "../baseEntities/BaseEntity";
export class ProductType extends BaseEntity {
    constructor() {
        super();
        this.name = undefined;
        this.allStore = undefined;
        this.isvalid = undefined;
        this.sortIndex = undefined;
        this.options = undefined;
    }
    GetEntityInfo() {
        return {
            Name: "ProductType",
            Index: "ebossh",
            Type: "productTypes"
        };
    }
    ;
}
//# sourceMappingURL=ProductType.js.map