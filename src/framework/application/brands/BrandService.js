import { BaseApplicationService } from "../BaseApplicationService";
export class BrandService extends BaseApplicationService {
    constructor() {
        super(...arguments);
        this._urls = {
            StoreList: 'IBrands/storeList',
            BrandGrades: 'IMemberGrades/getMemberGradeInfo',
            SendMsg: "VerificationCodes/send"
        };
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudStoreApi + url;
    }
    GetBrandStores() {
        let url = this.GetFullUrl(this._urls.StoreList);
        return this.Request.Request("POST", url, {
            p: {
                brandId: this.GetBrandInfo().brandId
            }
        }).then((res) => {
            return res;
        });
    }
    GetBrandGrades() {
        let url = this.GetFullUrl(this._urls.BrandGrades);
        return this.Request.Request("POST", url, {
            brandId: this.GetBrandInfo().brandId
        })
            .then((res) => {
            return res;
        });
    }
    SendMessage(phone) {
        let result = { success: false, message: "", data: null };
        if (!phone || phone.length != 11) {
            console.warn("手机号格式错误!");
            result.message = "手机号格式错误";
            return Promise.resolve(result);
        }
        let url = this.GetFullUrl(this._urls.SendMsg);
        let reqData = {
            allowtrycount: 3,
            mobile: phone,
            type: "mobilecode"
        };
        return this.Request.Request("POST", url, reqData).then((res) => {
            console.log(res);
            if (res && res.result && res.result.message == "") {
                result.success = true;
                result.data = res.result.data;
            }
            else
                result.message = res.result.message;
            return result;
        });
    }
    GetImplementsService() {
        return "IBrandService";
    }
}
//# sourceMappingURL=BrandService.js.map