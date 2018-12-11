import { BaseEntity } from "../baseEntities/BaseEntity";
class IntegralRuleDiscount {
}
class IntegralRuleBase {
}
export class IntegralRule extends BaseEntity {
    constructor() {
        super();
        this.type = "integral";
        this.allStore = true;
        this.base = undefined;
    }
    GetEntityInfo() {
        return {
            Name: "IntegralRule",
            Index: "activity",
            Type: "activities"
        };
    }
}
//# sourceMappingURL=IntegralRule.js.map