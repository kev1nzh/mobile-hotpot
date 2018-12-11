import { BaseEntity } from "../baseEntities/BaseEntity";
export class Order extends BaseEntity {
    ImplementsIStore() {
        return true;
    }
    GetEntityInfo() {
        return {
            Name: "Order",
            Index: "report",
            Type: "orders"
        };
    }
}
//# sourceMappingURL=Order.js.map