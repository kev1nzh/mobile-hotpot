import { BaseApplicationService } from "../BaseApplicationService";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { OrderLog } from "../../core/entities/behaviorLogs/OrderLog";
export class PaymentService extends BaseApplicationService {
    constructor() {
        super();
        this._orderLogR = RepositoryFactory.GetRepositoryInstance(OrderLog);
    }
    GetImplementsService() {
        return "IPaymentService";
    }
}
//# sourceMappingURL=PaymentService.js.map