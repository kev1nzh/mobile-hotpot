import { BaseApplicationService } from "../BaseApplicationService";
import { GetCacheInput } from "../../core/cache/dtos/GetCacheInput";
import { Common } from "../../core/common/Common";
import { IntegralRule } from "../../core/entities/activities/IntegralRule";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { EsQuery } from "../../core/repository/dtos/EsQuery";
import { ApplicationServiceFactory } from "../ApplicationServiceFactory";
export class ActivityService extends BaseApplicationService {
    constructor() {
        super();
        this._cacheKey = "Actitvity";
        this._urls = {
            Login: 'IActives',
        };
        this._integralRuleR = RepositoryFactory.GetRepositoryInstance(IntegralRule);
        this._couponS = ApplicationServiceFactory.GetServiceInstance("ICouponService");
        this._brandS = ApplicationServiceFactory.GetServiceInstance("IBrandService");
        this._memberS = ApplicationServiceFactory.GetServiceInstance("IMemberService");
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudStoreApi + url;
    }
    GetActivityByType(input) {
        let url = this.GetFullUrl(this._urls.Login);
        let storeInfo = this.GetStoreInfo();
        let brandInfo = this.GetBrandInfo();
        let dataObj = new Date();
        let reqData = {
            filter: {
                where: {
                    and: [
                        { brandId: brandInfo.brandId },
                        { activeType: input.type },
                        { startTime: { lt: dataObj.getTime() } },
                        { endTime: { gt: dataObj.getTime() } },
                        { status: 1 },
                        { or: [{ storeId: { like: '%' + storeInfo.storeId + '%' } }, { storeAll: 1 }] }
                    ]
                }
            }
        };
        return this.Request.Request("GET", url, reqData);
    }
    GetSpecialOffer() {
        let cacheKey = `${this._cacheKey}_${60}`;
        let that = this;
        let getCacheInput = new GetCacheInput(cacheKey, function () {
            return that.GetActivityByType({ type: 60 }).then((res) => {
                if (res && res.length) {
                    let date = new Date();
                    let day = date.getDay() === 0 ? 7 : date.getDay();
                    let specialOfferList = {};
                    res.forEach((element) => {
                        let times = element.times ? JSON.parse(element.times) : [];
                        let isValid = times.find((time) => {
                            let startTime = new Date(time.start);
                            let endTime = new Date(time.end);
                            let isStart, isEnd;
                            if (startTime.getHours() < date.getHours() && endTime.getHours() > date.getHours()) {
                                return true;
                            }
                            if (startTime.getHours() == date.getHours()) {
                                isStart = startTime.getMinutes() < date.getMinutes();
                            }
                            if (endTime.getHours() == date.getHours()) {
                                isEnd = endTime.getMinutes() < date.getMinutes();
                            }
                            return isStart && !isEnd;
                        });
                        if (element.week.indexOf(day) > -1 && isValid) {
                            let rules = JSON.parse(element.config);
                            rules.forEach((rule) => {
                                if (rule.productsList) {
                                    rule.productsList.forEach((p) => {
                                        let pk = p.id + '_' + p.scaleId;
                                        specialOfferList[pk] = {
                                            id: element.id,
                                            typeName: element.activeTypeName,
                                            type: element.activeType,
                                            key: pk,
                                            name: element.name,
                                            price: rule.priceLimit
                                        };
                                    });
                                }
                            });
                        }
                    });
                    return specialOfferList;
                }
                return {};
            });
        });
        return that.Cache.GetCacheAsync(getCacheInput);
    }
    GetRechargeForCoupon() {
        let that = this;
        return this.GetActivityByType({ type: 1 }).then((res) => {
            if (res && res.length > 0) {
                let activities = [];
                let couponIds = [];
                for (let index = 0; index < res.length; index++) {
                    const element = res[index];
                    if (element.config && element.config != "") {
                        let coupons = JSON.parse(element.config);
                        console.log(coupons);
                        coupons.forEach((coupon) => {
                            let obj = {
                                id: element.id,
                                status: element.status,
                                startAmount: coupon.startAmount,
                                coupons: coupon.couponId,
                                activeType: element.activeType,
                                activeTypeName: element.activeTypeName,
                                name: element.name
                            };
                            let couponIdList = coupon.couponId.map((coupon) => coupon.couponId);
                            couponIds = couponIds.concat(couponIdList);
                            activities.push(obj);
                        });
                    }
                }
                console.log(couponIds);
                return that._couponS.GetCouponInfoByIds(couponIds).then((couponRes) => {
                    couponRes.forEach((coupon) => {
                        for (let active of activities) {
                            for (let couponList of active.coupons) {
                                if (couponList.couponId == coupon.id) {
                                    couponList.couponInfo = coupon;
                                }
                            }
                        }
                    });
                    return activities;
                });
            }
            return [];
        });
    }
    GetRechargeForCash() {
        return this.GetActivityByType({ type: 30 }).then((res) => {
            if (res && res.length > 0) {
                let activities = [];
                for (let index = 0; index < res.length; index++) {
                    const element = res[index];
                    if (element.config && element.config != "") {
                        let rules = JSON.parse(element.config);
                        rules.forEach((rule) => {
                            let obj = {
                                id: element.id,
                                status: element.status,
                                startAmount: rule.startAmount,
                                balance: Number(rule.balance),
                                activeType: element.activeType,
                                activeTypeName: element.activeTypeName,
                                name: element.name
                            };
                            activities.push(obj);
                        });
                    }
                }
                return activities;
            }
            return [];
        });
    }
    GetRechangeLevel() {
        return this.Request.All([
            this._brandS.GetBrandGrades(),
            this.GetActivityByType({ type: 31 })
        ]).then((res) => {
            if (res && res.length > 0) {
                let gradeInfo = res[0];
                let active = res[1];
                console.log("gradeInfo", gradeInfo);
                let activities = [];
                for (let index = 0; index < active.length; index++) {
                    const element = active[index];
                    if (element.config && element.config != "") {
                        let rules = JSON.parse(element.config);
                        rules.forEach((rule) => {
                            let obj = {
                                id: element.id,
                                status: element.status,
                                amount: Number(rule.quota),
                                gradeId: Number(rule.gradeId),
                                gradeName: '',
                                activeType: element.activeType,
                                activeTypeName: element.activeTypeName,
                                name: element.name,
                            };
                            let thisGrade = gradeInfo.data.filter((p) => p.id == obj.gradeId)[0];
                            if (thisGrade)
                                obj.gradeName = thisGrade.name;
                            activities.push(obj);
                        });
                    }
                }
                console.log(activities);
                return activities;
            }
            return [];
        });
    }
    GetCouponPackage() {
        let that = this;
        return this.GetActivityByType({ type: 32 }).then((res) => {
            if (res && res.length > 0) {
                let activities = [];
                let couponIds = [];
                for (let index = 0; index < res.length; index++) {
                    const element = res[index];
                    if (element.config && element.config != "") {
                        let rule = JSON.parse(element.config);
                        let coupons = JSON.parse(element.couponId);
                        let couponList = coupons.map((p) => p.couponId);
                        couponIds = couponIds.concat(couponList);
                        let couponMap = Common.GroupBy(coupons, "couponId");
                        let obj = {
                            id: element.id,
                            status: element.status,
                            activeType: element.activeType,
                            activeTypeName: element.activeTypeName,
                            name: element.name,
                            startTime: element.startTime,
                            endTime: element.endTime,
                            price: rule.price,
                            vOrderId: rule.vorderId,
                            coupons: couponMap,
                        };
                        activities.push(obj);
                    }
                }
                return that._couponS.GetCouponInfoByIds(couponIds).then((couponRes) => {
                    activities.forEach((element) => {
                        for (const key in element.coupons) {
                            if (element.coupons.hasOwnProperty(key)) {
                                const couponInfo = element.coupons[key];
                                if (couponInfo) {
                                    element.coupons[key] = {
                                        couponId: key,
                                        info: couponRes.filter((p) => p.id == key)[0],
                                        count: couponInfo.length
                                    };
                                }
                            }
                        }
                    });
                    return activities;
                });
            }
            return [];
        });
    }
    GetIntegralRule() {
        let query = new EsQuery({
            Filter: { brandId: "#" }
        });
        return this._integralRuleR.GetAll(query).then((res) => {
            if (res.data.length < 1)
                return null;
            return res.data[0];
        });
    }
    GetImplementsService() {
        return "IActivityService";
    }
}
//# sourceMappingURL=ActivityService.js.map