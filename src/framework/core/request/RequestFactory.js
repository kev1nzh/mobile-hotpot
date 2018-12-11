import { ConfigCenter } from "../config/ConfigCenter";
class BaseRequest {
    constructor() {
        this.ConfigCenter = ConfigCenter.GetInstance();
    }
    SetDefaultParms(filter) {
        let storeInfo = this.ConfigCenter.GetStoreInfo();
        let brandInfo = this.ConfigCenter.GetBrandInfo();
        let sysInfo = this.ConfigCenter.GetSysInfo();
        if (filter && typeof filter === "object") {
            for (const key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (filter[key] && typeof filter[key] === "object") {
                        if (key === "brandId" || key === "brand_id" || key === "BrandId") {
                            if (Object.prototype.toString.call(filter[key]) === '[object Array]') {
                                for (let index = 0; index < filter[key].length; index++) {
                                    const element = filter[key][index];
                                    if (element === '#')
                                        filter[key][index] = brandInfo.brandId + "";
                                }
                            }
                        }
                        else if (key === "storeId" || key === "store_id" || key === "StoreId") {
                            if (Object.prototype.toString.call(filter[key]) === '[object Array]') {
                                for (let index = 0; index < filter[key].length; index++) {
                                    const element = filter[key][index];
                                    if (element === '#')
                                        filter[key][index] = storeInfo.storeId + "";
                                }
                            }
                        }
                        else if (key === "token" || key === "Token") {
                            if (Object.prototype.toString.call(filter[key]) === '[object Array]') {
                                for (let index = 0; index < filter[key].length; index++) {
                                    const element = filter[key][index];
                                    if (element === '#')
                                        filter[key][index] = sysInfo.token.token;
                                }
                            }
                        }
                        else
                            this.SetDefaultParms(filter[key]);
                    }
                    else {
                        if ((key === "brandId" || key === "brand_id" || key === "BrandId") && filter[key] === '#') {
                            filter[key] = brandInfo.brandId + '';
                        }
                        else if ((key === "storeId" || key === "store_id" || key === "StoreId") && filter[key] === '#') {
                            filter[key] = storeInfo.storeId + '';
                        }
                        else if ((key === "token" || key === "Token") && filter[key] === '#') {
                            filter[key] = sysInfo.token.token;
                        }
                    }
                }
            }
        }
        return filter;
    }
}
export class AxiosRequest extends BaseRequest {
    constructor(axios) {
        super();
        this._axios = axios;
        this.InitInterceptors();
    }
    InitInterceptors() {
        this._axios.interceptors.request.use(function (config) {
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
        this._axios.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            let response = error.response;
            if (response.status == 401) {
                alert("权限受限,试试刷新!");
            }
            return Promise.resolve(error);
        });
    }
    GetAuth() {
        let sysInfo = this.ConfigCenter.GetSysInfo();
        if (sysInfo && sysInfo.token && sysInfo.token.token) {
            return sysInfo.token.token;
        }
        return null;
    }
    Request(method, url, data) {
        let options = { method: method, url: url };
        let token = this.GetAuth();
        if (token) {
            options.headers = {
                'token': token,
                'Content-Type': "application/json; charset=utf-8"
            };
        }
        if (method.toUpperCase() === "GET" && data)
            options.params = this.SetDefaultParms(data);
        else
            options.data = this.SetDefaultParms(data);
        return this._axios(options).then((res) => {
            return Promise.resolve(res.data);
        }, (err) => {
            return Promise.reject(err);
        });
    }
    All(promise) {
        return this._axios.all(promise);
    }
}
export class XmlHttpRequest extends BaseRequest {
    Request(method, url, data) {
        return Promise.resolve(null);
    }
    All(promise) {
        throw new Error("没有实现!");
    }
}
//# sourceMappingURL=RequestFactory.js.map