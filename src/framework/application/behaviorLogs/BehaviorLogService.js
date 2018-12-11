import { BaseApplicationService } from "../BaseApplicationService";
import { BehaviorLogEnum } from "../../core/enums/BehaviorLogEnum";
import { OrderLog } from "../../core/entities/behaviorLogs/OrderLog";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
export class BehaviorLogService extends BaseApplicationService {
    constructor() {
        super();
        this._orderLogR = RepositoryFactory.GetRepositoryInstance(OrderLog);
    }
    SaveBehaviorLog(data) {
        if (data.type == BehaviorLogEnum.OrderLog) {
            return this.SaveOrderLog((data));
        }
        return Promise.resolve("没有Type,休想添加日志!");
    }
    SaveOrderLog(data) {
        let bigData = {};
        if (data.details) {
            bigData.details = JSON.stringify(data.details);
            data.details = undefined;
        }
        if (data.payment) {
            bigData.payment = JSON.stringify(data.payment);
            data.payment = undefined;
        }
        if (data.discount) {
            bigData.discount = JSON.stringify(data.payment);
            data.discount = undefined;
        }
        data.bigData = bigData;
        return this._orderLogR.Create(data);
    }
    GetImplementsService() {
        return "IBehaviorLogService";
    }
}
//# sourceMappingURL=BehaviorLogService.js.map