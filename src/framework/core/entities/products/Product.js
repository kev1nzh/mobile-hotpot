import { BaseEntity } from "../baseEntities/BaseEntity";
class ProductBase {
    constructor() {
        this.name = undefined;
        this.alias = undefined;
        this.intro = undefined;
        this.pinyin = undefined;
        this.kitchen = undefined;
        this.unit = undefined;
        this.category = undefined;
        this.options = undefined;
        this.picInfo = undefined;
        this.components = undefined;
        this.scales = undefined;
        this.tags = undefined;
        this.salesTime = undefined;
        this.productsList = undefined;
        this.zixuanProducts = undefined;
        this.rule = undefined;
        this.limit = undefined;
        this.status = undefined;
    }
}
export class Product extends BaseEntity {
    constructor() {
        super();
        this.type = undefined;
        this.allStore = undefined;
        this.brand_name = undefined;
        this.base = new ProductBase();
        this.isExtra = undefined;
        this.operateperson = undefined;
        this.storeIds = undefined;
        this.onsaleing = undefined;
    }
    GetEntityInfo() {
        return {
            Name: "Product",
            Index: "ebossh",
            Type: "products"
        };
    }
    ;
}
//# sourceMappingURL=Product.js.map