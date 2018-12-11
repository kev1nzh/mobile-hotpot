import { BaseApplicationService } from "../BaseApplicationService";
import { CouponRule } from "../../core/entities/coupons/CouponRule";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { GetCacheInput } from "../../core/cache/dtos/GetCacheInput";
import { EsQuery } from "../../core/repository/dtos/EsQuery";
import { Common } from "../../core/common/Common";
export class CouponService extends BaseApplicationService {
    constructor() {
        super();
        this._couponRuleCacheKey = "CouponRule";
        this._urls = {
            getCoupons: "IMembers/couponList",
            coupons: "ICoupons"
        };
        this._rCouponRule = RepositoryFactory.GetRepositoryInstance(CouponRule);
        this.Cache.AddCache({
            key: this._couponRuleCacheKey,
            data: null,
            timeSpan: 1000 * 60 * 30
        });
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudStoreApi + url;
    }
    GetBrandCouponRule() {
        let that = this;
        let getCache = new GetCacheInput(this._couponRuleCacheKey, function () {
            let query = new EsQuery({ Filter: { brandId: "#" }, Size: 5 });
            return that._rCouponRule.GetAll(query).then((res) => {
                if (res.data.length < 1) {
                    return new CouponRule();
                }
                else
                    return res.data[0];
            });
        });
        return this.Cache.GetCacheAsync(getCache);
    }
    GetCouponInfoByIds(ids) {
        let url = this.GetFullUrl(this._urls.coupons);
        let reqData = {
            filter: {
                where: {
                    "id": { "inq": Common.Distinct(ids) },
                    "status": 1
                }
            }
        };
        return this.Request.Request("GET", url, reqData);
    }
    GetImplementsService() {
        return "ICouponService";
    }
}
//# sourceMappingURL=CouponService.js.map