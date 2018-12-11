import { BaseEntity } from "../baseEntities/BaseEntity";
export class StoreInfo extends BaseEntity {
    constructor(storeId, storeName) {
        super();
        this.storeId = storeId;
        this.id = storeId;
        this.storeName = storeName;
    }
    ImplementsIStore() {
        return true;
    }
    GetEntityInfo() {
        return {
            Name: "StoreInfo",
            Index: "globalbase",
            Type: "store"
        };
    }
}
//# sourceMappingURL=StoreInfo.js.map