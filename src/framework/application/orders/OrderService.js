import { BaseApplicationService } from "../BaseApplicationService";
import { RefundProduct } from '../../core/entities/products/RefundProduct';
import { RepositoryFactory } from '../../core/repository/RepositoryFactory';
import { EsQuery } from '../../core/repository/dtos/EsQuery';
import { FreeProduct } from "../../core/entities/products/FreeProduct";
import { SaveOrderDto } from "./dtos/SaveOrderDto";
import { Order } from "../../core/entities/orders/Order";
import { ApplicationServiceFactory } from "../ApplicationServiceFactory";
import { Common } from "../../core/common/Common";
export class OrderService extends BaseApplicationService {
    constructor() {
        super();
        this._urls = {
            OrderDetail: 'Orders/getOrdersDetailByStore',
            SaveOrder: "Orders/save2",
            MemberOrders: "Orders/getOrdersListByMember",
            PayForOrder: "Payments/payforOrders"
        };
        this._refundProductR = RepositoryFactory.GetRepositoryInstance(RefundProduct);
        this._freeProductR = RepositoryFactory.GetRepositoryInstance(FreeProduct);
        this._orderR = RepositoryFactory.GetRepositoryInstance(Order);
        this._productS = ApplicationServiceFactory.GetServiceInstance("IProductService");
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudOrderApi + url;
    }
    GetStoreIngOrder() {
        throw new Error("Method not implemented.");
    }
    GetOrderDetail(orderId) {
        let reqData = { brandId: "#", ordersId: orderId };
        let url = this.GetFullUrl(this._urls.OrderDetail);
        return this.Request.All([
            this.Request.Request("POST", url, reqData),
            this.GetOrderRefundPro(orderId),
            this.GerOrderFreePro(orderId),
            this._productS.GetStoreProducts({ dataType: 0 })
        ]).then((res) => {
            let orderInfoRes = JSON.parse(res[0].result.data);
            console.log("orderInfoRes", orderInfoRes);
            let orderRefundPros = res[1];
            let orderFreePros = res[2];
            let storePro = res[3];
            let orderInfo = orderInfoRes.orders;
            orderInfo.originalPrice = Number(orderInfo.originalPrice);
            orderInfo.paidFee = Number(orderInfo.paidFee);
            orderInfo.products = [];
            orderInfo.freePros = orderFreePros;
            orderInfo.refundPros = orderRefundPros;
            orderInfoRes.detail.forEach((element) => {
                if (element.parentId == "0") {
                    if (element.itemType == 'taocan' || element.itemType == 'zixuan') {
                        element.originalPrice = element.paidFee;
                    }
                    let originalPrice = Number(element.originalPrice);
                    if (originalPrice > 0 && element.cnt > 0)
                        element.unitPrice = +(originalPrice / element.cnt).toFixed(2);
                    if (element.weight && element.weight == '0.100') {
                        if (element.weight == '0.100') {
                            let tempWeight = Number(element.weight);
                            element.originalPrice = ((Number(element.originalPrice) / tempWeight)).toFixed(2);
                            element.paidFee = ((Number(element.paidFee) / tempWeight)).toFixed(2);
                            element.unitPrice = Number(element.originalPrice);
                            element.weight = '0';
                        }
                        else {
                            element.weight = element.weight.toFixed(2);
                        }
                    }
                    this.CtorDetailFreePro(orderFreePros, element, orderInfo.status);
                    this.CtorDetailComponents(orderInfoRes.component, element);
                    let subPros = orderInfoRes.detail.filter((p) => p.parentId == element.detailId);
                    if (subPros && subPros.length > 0) {
                        subPros.forEach((subPro) => {
                            let subOriginalPrice = Number(subPro.originalPrice);
                            if (subOriginalPrice > 0 && subPro.cnt > 0)
                                subPro.unitPrice = +(subOriginalPrice / subPro.cnt).toFixed(2);
                            this.CtorDetailFreePro(orderFreePros, subPro, orderInfo.status);
                            this.CtorDetailComponents(orderInfoRes.component, subPro);
                            if (subPro.tips == "换购品") {
                                subPro.subType = "huangou";
                            }
                            else if (element.itemType == "zixuan" || element.itemType == "taocan") {
                                subPro.subType = element.itemType;
                            }
                            else if (subPro.tips == "加料") {
                                subPro.subType = "addon";
                            }
                        });
                        element.products = subPros;
                    }
                    if (element.type != "taocan" && element.type != "zixuan") {
                        let pro = storePro[element.productId];
                        if (pro.isExtra)
                            element.isExtra = true;
                        else if (pro.base.options) {
                            element.options = pro.base.options;
                            element.categoryId = pro.base.category.id;
                        }
                    }
                    orderInfo.products.push(element);
                }
            });
            if (orderInfo.status == "Success") {
                let totalAmount = Common.Sum(orderInfoRes.discount, "discountFee");
                orderInfo.discount = {
                    amount: totalAmount,
                    items: orderInfoRes.tempDiscount,
                    items2: orderInfoRes.discount,
                };
                let payments = orderInfoRes.payment.map((p) => {
                    return {
                        status: p.status,
                        payType: p.payType,
                        payTypeName: "现金",
                        totalFee: p.totalFee,
                        ordersId: p.ordersId,
                        memberId: p.memberId,
                        id: p.id,
                        addTime: p.addTime,
                        payTime: p.payTime
                    };
                });
                orderInfo.payments = payments;
            }
            return orderInfo;
        });
    }
    CtorDetailFreePro(arr, element, status) {
        if (arr && arr.length > 0) {
            let freePros = arr.filter((p) => p.detailId == element.detailId);
            if (freePros && freePros.length > 0 && status !== "Success") {
                let paidFee = Number(element.paidFee);
                let count = element.cnt;
                for (let index = 0; index < freePros.length; index++) {
                    const freePro = freePros[index];
                    count -= freePro.cnt;
                    paidFee -= freePro.amount;
                }
                element.paidFee = paidFee + "";
                element.cnt = count;
            }
        }
    }
    CtorDetailComponents(arr, element) {
        if (arr && arr.length > 0)
            element.components = arr.filter((p) => p.ordersDetailId == element.detailId);
    }
    GetOrderRefundPro(orderId) {
        let query = new EsQuery({
            Filter: {
                brandId: "#",
                storeId: "#",
                ordersId: orderId
            }
        });
        return this._refundProductR.GetAll(query).then(res => { return res.data; });
    }
    GerOrderFreePro(orderId) {
        let query = new EsQuery({
            Filter: {
                brandId: "#",
                storeId: "#",
                ordersId: orderId
            }
        });
        return this._freeProductR.GetAll(query).then(res => { return res.data; });
    }
    GetMemberOrders(input) {
        if (!input.memberId)
            input.memberId = this.ConfigCenter.GetSysInfo().memberId;
        if (!input.memberId)
            throw new Error("没有MemberId,我很难满足你啊，小伙;");
        if (!input.status)
            input.status = "All";
        if (!input.pageSize)
            input.pageSize = 10;
        let reqData = {
            memberId: input.memberId,
            page: input.pageIndex,
            rp: input.pageSize,
            status: input.status
        };
        let url = this.GetFullUrl(this._urls.MemberOrders);
        return this.Request.Request("POST", url, reqData).then((res) => {
            if (res && res.result && res.result.message == "") {
                let data = JSON.parse(res.result.data);
                return data;
            }
            console.error(res.result.message);
            return null;
        });
    }
    GetMemberOrdersCount(input) {
        if (!input.memberId)
            input.memberId = this.ConfigCenter.GetSysInfo().memberId;
        if (!input.memberId)
            throw new Error("没有MemberId,我很难满足你啊，小伙;");
        let dsl = new EsQuery({
            Filter: {
                type: "order",
                member_id: input.memberId,
                brand_id: "#",
                data_valid: "1"
            },
            Size: 0
        });
        return this._orderR.GetAll(dsl).then((res) => {
            return res.total;
        });
    }
    SaveOrder(orderInfo) {
        let sysInfo = this.ConfigCenter.GetSysInfo();
        let storeInfo = this.GetStoreInfo();
        let saveInfo = new SaveOrderDto();
        saveInfo.infos.brandId = "#";
        saveInfo.infos.storeId = "#";
        if (orderInfo.info.ordersId) {
            saveInfo.infos.ordersId = orderInfo.info.ordersId;
        }
        else {
            if (sysInfo && sysInfo.isUser) {
                saveInfo.infos.syId = sysInfo.sysId;
                saveInfo.infos.syName = sysInfo.sysName;
                saveInfo.infos.channleType = "点餐宝";
            }
            else {
                saveInfo.infos.channleType = "微信小程序";
                saveInfo.infos.memberId = sysInfo.memberId;
            }
            if (!orderInfo.info.ordersType)
                saveInfo.infos.ordersType = "点餐";
            saveInfo.infos.deskId = orderInfo.info.deskId;
            saveInfo.infos.deskAlias = orderInfo.info.deskName;
            if (!saveInfo.infos.eatType) {
                saveInfo.infos.eatType = "堂食";
            }
            saveInfo.infos.subject = `${saveInfo.infos.ordersType}-${storeInfo.storeName}`;
            saveInfo.infos.person = orderInfo.info.person;
        }
        saveInfo.ordersArray = orderInfo.products;
        let url = this.GetFullUrl(this._urls.SaveOrder);
        return this.Request.Request("POST", url, saveInfo).then((res) => {
            return res.result;
        });
    }
    UpdateOrder() {
        throw new Error("Method not implemented.");
    }
    DeleteOrder() {
        throw new Error("Method not implemented.");
    }
    CancelOrder() {
        throw new Error("Method not implemented.");
    }
    UpdateWeight() {
        throw new Error("Method not implemented.");
    }
    PayForOrder(data) {
        let result = { success: false, message: "", data: null };
        if (!data.payType) {
            result.message = "请选择支付方式";
            return Promise.resolve(result);
        }
        else if (data.payType.wxWeb && !data.openId) {
            result.message = "微信支付需要OpenId";
            return Promise.resolve(result);
        }
        if (!data.brandId)
            data.brandId = "#";
        let url = this.GetFullUrl(this._urls.PayForOrder);
        return this.Request.Request("POST", url, data).then((res) => {
            if (res.result) {
                if (res.result.message != "") {
                    result.message = res.result.message;
                    return result;
                }
                else {
                    result.success = true;
                    result.message = "";
                    result.data = res.result.data;
                    return result;
                }
            }
            result.message = "支付失败";
            return result;
        });
    }
    GetImplementsService() {
        return "IOrderService";
    }
}
//# sourceMappingURL=OrderService.js.map