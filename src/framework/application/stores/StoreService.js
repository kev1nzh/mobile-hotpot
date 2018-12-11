import { BaseApplicationService } from "../BaseApplicationService";
import { StoreInfo } from "../../core/entities/stores/StoreInfo";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { BrandInfo } from "../../core/entities/brands/BrandInfo";
export class StoreService extends BaseApplicationService {
    constructor() {
        super();
        this._urls = {
            "StoreInfo": "IStores/storeInfo"
        };
        this._storeInfoR = RepositoryFactory.GetRepositoryInstance(StoreInfo);
    }
    GetFullUrl(url) {
        return `${this.GlobalUrl.CloudStoreApi}${url}`;
    }
    GetBrandStoreInfo(data) {
        console.warn("请不要使用这个接口,移步 [GetBrandStoreinfoByApi]");
        return Promise.reject();
    }
    GetBrandStoreinfoByApi(data) {
        let url = this.GetFullUrl(this._urls.StoreInfo);
        let brandId;
        let storeId;
        if (data && data.storeId && data.brandId) {
            brandId = data.brandId;
            storeId = data.storeId;
        }
        else {
            brandId = "#";
            storeId = "#";
        }
        let reqData = { "brandId": brandId, "storeId": storeId };
        let that = this;
        return this.Request.Request("POST", url, { p: reqData }).then((res) => {
            if (res && res.result.message == "") {
                console.log(res.result.data);
                let data = res.result.data;
                let fullStoreInfo = new StoreInfo(data.id, data.name);
                fullStoreInfo._id = "FullData";
                fullStoreInfo.brandId = Number(data.brandId);
                fullStoreInfo.brandName = data.brandName;
                fullStoreInfo.molingGlobal = data.malingGlobal;
                fullStoreInfo.molingRuleName = data.malingRulesName;
                fullStoreInfo.molingRules = data.malingRules;
                fullStoreInfo.payMode = data.payMode;
                fullStoreInfo.payModeName = data.payModeName;
                let oldBrandInfo = that.GetBrandInfo();
                if (oldBrandInfo && oldBrandInfo.brandName && !fullStoreInfo.brandName)
                    fullStoreInfo.brandName = oldBrandInfo.brandName;
                if ((!data || !data.storeId || !data.brandId) || (data && data.refreshCache)) {
                    this.ConfigCenter.SetStoreInfo(fullStoreInfo);
                    let brandInfo = new BrandInfo(fullStoreInfo.brandId, fullStoreInfo.brandName);
                    this.ConfigCenter.SetBrandInfo(brandInfo);
                }
                return fullStoreInfo;
            }
            return null;
        });
    }
    GetImplementsService() {
        return "IStoreService";
    }
}
//# sourceMappingURL=StoreService.js.map