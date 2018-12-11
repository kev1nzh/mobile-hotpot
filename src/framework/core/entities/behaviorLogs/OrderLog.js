import { BehaviorLog } from "./BehaviorLog";
export class OrderLog extends BehaviorLog {
    constructor() {
        super();
        this.createTime = new Date().getTime();
    }
    GetEntityInfo() {
        let entityInfo = super.GetEntityInfo();
        entityInfo.Type = "orderLog";
        return entityInfo;
    }
}
//# sourceMappingURL=OrderLog.js.map