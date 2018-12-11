import { BaseApplicationService } from "../BaseApplicationService";
import { ApplicationServiceFactory } from "../ApplicationServiceFactory";
class DiscountInfo {
    constructor(storeInfo, orderInfo, specialOfferData, discountPros, couponRule, memberInfo, integralRuleBak) {
        this.storeInfo = storeInfo;
        this.orderInfo = orderInfo;
        this.specialOfferData = specialOfferData;
        this.discountPros = discountPros;
        this.couponRule = couponRule;
        this.memberInfo = memberInfo;
        this.integralRuleBak = integralRuleBak;
        this.discount = {
            item: {
                freePro: {
                    totalAmount: 0,
                    key: "freePro",
                    name: "赠菜",
                    data: [],
                },
                fullOrder: {
                    totalAmount: 0,
                    key: "fullOrder",
                    name: "手工折扣",
                    type: 0,
                },
                specialPro: {
                    totalAmount: 0,
                    key: "specialPro",
                    name: "会员特价"
                },
                member: {
                    totalAmount: 0,
                    key: "member",
                    name: "会员折扣",
                },
                reducePro: {
                    totalAmount: 0,
                    key: "reducePro",
                    name: "减价商品"
                },
                limitPro: {
                    totalAmount: 0,
                    key: "limitPro",
                    name: "减价商品"
                },
                discountPro: {
                    totalAmount: 0,
                    key: "discountPro",
                    name: "减价商品"
                },
                moling: {
                    totalAmount: 0,
                    key: "moling",
                    name: "全局抹零"
                },
                orderCoupon: {
                    totalAmount: 0,
                    key: "orderCoupon",
                    name: "订单券",
                    data: []
                },
                proCoupon: {
                    totalAmount: 0,
                    key: "proCoupon",
                    name: "商品券",
                    data: []
                },
                integral: {
                    name: "积分优惠",
                    key: "integral",
                    isUsed: false,
                    totalAmount: 0,
                    integralCount: 0
                }
            },
            totalDiscount: 0
        };
        this.memberCoupons = [];
        this.integralRule = {
            enable: false,
            maxUseIntegral: 0,
            limitPrice: '',
            maxExChangeMoney: 0,
            oneIntegralForMoney: 0
        };
        this.Init();
    }
    Init() {
        this.Reset();
        this.InitFreeProDiscount();
        if (this.discount.item.fullOrder.totalAmount <= 0 || (this.discount.item.fullOrder.totalAmount > 0 && this.discount.item.fullOrder.type == 2)) {
            this.InitProDiscount();
        }
        if (this.orderInfo.memberId != "0" && this.memberInfo) {
            this.InitIntegralRule();
        }
        this.CalculationTotalDiscount();
        this.InitCanUseCoupon();
    }
    Reset() {
        this.discount.totalDiscount = 0;
        for (const key in this.discount.item) {
            if (this.discount.item.hasOwnProperty(key)) {
                const element = this.discount.item[key];
                if (element.totalAmount) {
                    element.totalAmount = 0;
                }
                if (element.data) {
                    if (Object.prototype.toString.call(element.data) === '[object Array]') {
                        element.data = [];
                    }
                    else {
                        element.data = {};
                    }
                }
            }
        }
    }
    InitFreeProDiscount() {
        console.log("----- 初始化赠菜信息 -----");
        this.discount.item.freePro.totalAmount = 0;
        this.discount.item.freePro.data = [];
        if (this.orderInfo.freePros && this.orderInfo.freePros.length > 0) {
            let totalFreeProAmount = 0;
            this.orderInfo.freePros.forEach((element) => {
                totalFreeProAmount += element.amount;
                this.discount.item.freePro.data.push(element);
            });
            this.discount.totalDiscount += totalFreeProAmount;
            this.discount.item.freePro.totalAmount = totalFreeProAmount;
        }
    }
    InitProDiscount() {
        console.log("----- 初始化商品级优惠 -----");
        console.log(this.orderInfo);
        for (let index = 0; index < this.orderInfo.products.length; index++) {
            const element = this.orderInfo.products[index];
            if (element) {
                if (element.itemType !== 'taocan' && element.itemType !== 'zixuan' && element.parentId == '0') {
                    let canDis_count = element.cnt;
                    if (this.orderInfo.freePros && this.orderInfo.freePros.length > 0) {
                        let freePros = this.orderInfo.freePros.filter((p) => p.detailId == element.detailId);
                        if (freePros.length > 0) {
                            freePros.forEach((freePro) => {
                                canDis_count -= freePro.cnt;
                            });
                        }
                    }
                    if (canDis_count > 0 && Number(element.paidFee > 0) && element.cnt > 0) {
                        if (this.orderInfo.memberId != "0" && this.memberInfo) {
                            this.InitMemberDiscount(element, canDis_count);
                            this.InitMemberSpecialPrice(element, canDis_count);
                        }
                        this.InitProReduceDiscount(element, canDis_count);
                    }
                }
            }
        }
    }
    InitMemberDiscount(element, canDis_count) {
        console.log("----- 初始化会员折扣 -----");
        if (element) {
            if (!element.isExtra && element.options && !element.options.memberdiscountunable) {
                let memberDiscount = (this.memberInfo.disCount * 10) / 100;
                let discountAmount = (Number(element.paidFee) / element.cnt) * (1 - memberDiscount);
                for (let index = 0; index < canDis_count; index++) {
                    this.AddProDiscount(element, index, discountAmount, "member");
                }
            }
        }
    }
    AddProDiscount(element, index, amount, type, extend) {
        if (!element.discount)
            element.discount = {};
        let unitPrice = Number(element.paidFee) / element.cnt;
        if (unitPrice < amount) {
            amount = unitPrice;
        }
        let primaryKey = element.productId + "_" + element.scaleId + "_" + index;
        let discountType = this.discount.item[type];
        let discountObj = {
            name: discountType.name,
            type: type,
            amount: +amount.toFixed(2),
            key: primaryKey
        };
        if (extend) {
            if (extend.name)
                discountObj.name += "_" + extend.name;
            if (extend.id)
                discountObj.id = extend.id;
            if (extend.type)
                discountObj.aviType = extend.type;
            if (extend.serialNumber)
                discountObj.serialNumber = extend.serialNumber;
        }
        let oldDiscount = element.discount[primaryKey];
        if (!oldDiscount) {
            element.discount[primaryKey] = discountObj;
            this.discount.item[discountType.key].totalAmount = +(this.discount.item[discountType.key].totalAmount + discountObj.amount).toFixed(2);
            return true;
        }
        else if (oldDiscount && oldDiscount.amount < amount) {
            element.discount[primaryKey] = discountObj;
            this.discount.item[discountType.key].totalAmount = +(this.discount.item[discountType.key].totalAmount + discountObj.amount).toFixed(2);
            this.discount.item[oldDiscount.type].totalAmount = +(this.discount.item[oldDiscount.type].totalAmount - oldDiscount.amount).toFixed(2);
            return true;
        }
        else {
            return false;
        }
    }
    InitMemberSpecialPrice(element, canDis_count) {
        if (element) {
            let pk = element.productId + "_" + element.scaleId;
            let specialPro = null;
            if (this.specialOfferData)
                specialPro = this.specialOfferData[pk];
            if (specialPro) {
                let gradeId = Number(this.memberInfo.gradeId);
                let discountedPrice = specialPro.price[gradeId];
                if (discountedPrice) {
                    let discountAmount = (Number(element.paidFee) / element.cnt) - discountedPrice;
                    for (let index = 0; index < canDis_count; index++) {
                        this.AddProDiscount(element, index, discountAmount, "specialPro", {
                            id: specialPro.id,
                            typeName: specialPro.typeName,
                            type: specialPro.type,
                            name: specialPro.name
                        });
                    }
                }
            }
        }
    }
    InitProReduceDiscount(element, canDis_count) {
        if (element && this.discountPros) {
            if (element.parentId != "0") {
                let parentPro = this.orderInfo.products.filter((p) => p.detailId == element.parentId)[0];
                if (parentPro.itemType === 'taocan' || parentPro.itemType === 'zixuan')
                    return;
            }
            let key = element.productId + "_" + element.scaleId;
            let discounts = this.discountPros[key];
            if (discounts && discounts.length > 0) {
                let discount = discounts[0];
                let discountAmount = 0;
                let discountType = "reducePro";
                let unitPrice = Number(element.paidFee) / element.cnt;
                if (discount.rule.type == 'reduce') {
                    discountAmount = Number(discount.rule.val);
                    discountType = "reducePro";
                }
                else if (discount.rule.type == 'limit') {
                    discountAmount = unitPrice - Number(discount.rule.val);
                    discountType = "limitPro";
                }
                else if (discount.rule.type == 'discount') {
                    discountAmount = (unitPrice * (1 - Number(discount.rule.val)));
                    discountType = "discountPro";
                }
                for (let index = 0; index < canDis_count; index++) {
                    this.AddProDiscount(element, index, discountAmount, discountType, {
                        id: discount.discountId,
                        typeName: "优惠活动",
                        name: discount.discountName
                    });
                }
            }
        }
    }
    CalculationTotalDiscount() {
        this.discount.item.moling.totalAmount = 0;
        let totalDiscount = 0;
        if (this.discount.item.fullOrder.totalAmount <= 0 || (this.discount.item.fullOrder.totalAmount > 0 && this.discount.item.fullOrder.type == 2)) {
            for (const key in this.discount.item) {
                if (this.discount.item.hasOwnProperty(key)) {
                    const element = this.discount.item[key];
                    totalDiscount += element.totalAmount;
                }
            }
        }
        else {
            totalDiscount = (this.discount.item.fullOrder.totalAmount + this.discount.item.freePro.totalAmount);
        }
        let moling = this.CalculationMoling(totalDiscount);
        if (moling > 0) {
            this.discount.item.moling.totalAmount = moling;
            totalDiscount += moling;
        }
        this.discount.totalDiscount = +totalDiscount.toFixed(2);
    }
    CalculationMoling(totalDiscount) {
        console.log("------ 计算全局抹零 -------");
        if (this.storeInfo.molingGlobal == 1 && this.storeInfo.molingRules > 0) {
            var needPay = +(this.orderInfo.paidFee - totalDiscount).toFixed(2);
            var decimal = +(needPay - (~~needPay)).toFixed(2);
            let afterDecimal = 0;
            if (this.storeInfo.molingRules === 3) {
                afterDecimal = 0;
            }
            else if (this.storeInfo.molingRules === 2) {
                afterDecimal = decimal >= 0.5 ? 0.5 : 0;
            }
            else if (this.storeInfo.molingRules === 1) {
                afterDecimal = +(~~(decimal * 10) / 10).toFixed(2);
            }
            else {
                return 0;
            }
            return +(decimal - afterDecimal).toFixed(2);
        }
        return 0;
    }
    InitCanUseCoupon() {
        console.log("----- 初始化可用的优惠券 ------");
        this.memberCoupons = [];
        if (this.memberInfo && this.orderInfo.memberId != '0') {
            let canUseMemberCoupons = [];
            let now = (new Date()).getTime();
            let coupons = this.memberInfo.coupons.filter((p) => p.brandId == this.storeInfo.brandId && p.endTime > now && p.startTime <= now);
            for (let index = 0; index < coupons.length; index++) {
                const coupon = coupons[index];
                let isThisStoreCoupon = false;
                if (coupon.stores) {
                    let storeCoupons = coupon.stores.filter((p) => p.storeId == '-1' || p.storeId == this.storeInfo.storeId);
                    if (storeCoupons.length > 0)
                        isThisStoreCoupon = true;
                }
                if (isThisStoreCoupon) {
                    if (coupon.voucherType == 2) {
                        let couponPros = coupon.products;
                        for (let index = 0; index < couponPros.length; index++) {
                            const couponPro = couponPros[index];
                            let orderPros = [];
                            if (couponPro.scaleId) {
                                orderPros = this.orderInfo.products.filter((p) => p.productId == couponPro.productId && p.scaleId == couponPro.scaleId && p.cnt > 0);
                            }
                            else {
                                orderPros = this.orderInfo.products.filter((p) => p.productId == couponPro.productId && p.cnt > 0);
                            }
                            let freeCount = 0;
                            let orderProCount = 0;
                            orderPros.forEach((orderPro) => {
                                orderProCount += orderPro.cnt;
                                if (this.orderInfo.freePros) {
                                    let freePros = this.orderInfo.freePros.filter((p) => p.detailId == orderPro.detailId);
                                    if (freePros.length > 0) {
                                        freePros.forEach((freePro) => {
                                            freeCount += freePro.cnt;
                                        });
                                    }
                                }
                            });
                            if (orderPros.length > 0 && orderProCount > freeCount) {
                                canUseMemberCoupons.push(coupon);
                                break;
                            }
                        }
                    }
                    else if (coupon.voucherType == 1) {
                        let canUseFlag = false;
                        let couponPros = [];
                        if (coupon.productIds) {
                            if (typeof coupon.productIds == 'string') {
                                couponPros = JSON.parse(coupon.productIds);
                                if (!couponPros)
                                    couponPros = [];
                            }
                            else
                                couponPros = coupon.productIds;
                        }
                        let condition = { totalAmount: 0 };
                        if (coupon.condition) {
                            if (typeof coupon.condition == 'string') {
                                condition = JSON.parse(coupon.condition);
                                if (!condition)
                                    condition = { totalAmount: 0 };
                            }
                            else
                                condition = coupon.condition;
                        }
                        if (couponPros.length > 0) {
                            let totalAmount = 0;
                            for (let index = 0; index < couponPros.length; index++) {
                                const couponPro = couponPros[index];
                                let orderPros = this.orderInfo.products.filter((p) => p.productId == couponPro.productId && p.cnt > 0);
                                if (orderPros.length > 0) {
                                    if (condition.totalAmount && Number(condition.totalAmount) > 0) {
                                        orderPros.forEach((p) => {
                                            let paidFee = Number(p.paidFee);
                                            if (p.discount) {
                                                let totalDiscount = 0;
                                                for (const key in p.discount) {
                                                    if (p.discount.hasOwnProperty(key)) {
                                                        const disobj = p.discount[key];
                                                        totalDiscount += disobj.amount;
                                                    }
                                                }
                                                totalAmount += (paidFee - totalDiscount);
                                            }
                                            else {
                                                totalAmount += paidFee;
                                            }
                                        });
                                    }
                                }
                            }
                            if (Number(condition.totalAmount) <= totalAmount) {
                                canUseFlag = true;
                            }
                        }
                        else {
                            if (condition.totalAmount && Number(condition.totalAmount) > 0) {
                                if (Number(condition.totalAmount) <= this.orderInfo.paidFee - this.discount.totalDiscount) {
                                    canUseFlag = true;
                                }
                            }
                            else
                                canUseFlag = true;
                        }
                        if (canUseFlag)
                            canUseMemberCoupons.push(coupon);
                    }
                }
            }
            this.memberCoupons = canUseMemberCoupons;
        }
    }
    CheckCanUseCoupon(coupon) {
        let res = this.couponRule;
        if (!res.canuseboth) {
            let voucherType = 'proCoupon';
            if (coupon.voucherType == 2)
                voucherType = 'orderCoupon';
            let useCoupons = this.discount.item[voucherType].data;
            if (useCoupons.length > 0) {
                return {
                    canUse: false,
                    message: '订单券和商品券无法同享'
                };
            }
        }
        if (coupon.voucherType == 2) {
            let useProductCoupons = this.discount.item.proCoupon.data;
            if (res.productcouponrules.limited && (useProductCoupons.length + 1) > res.productcouponrules.count) {
                return {
                    canUse: false,
                    message: '商品券最多使用' + res.productcouponrules.count + '张'
                };
            }
        }
        else if (coupon.voucherType == 1) {
            let useOrderCoupons = this.discount.item.orderCoupon.data;
            if (res.ordercouponrules.limited && (useOrderCoupons.length + 1) > res.ordercouponrules.count) {
                return {
                    canUse: false,
                    message: '订单券最多使用' + res.ordercouponrules.count + '张'
                };
            }
        }
        return {
            canUse: true
        };
    }
    InitIntegralRule() {
        console.log("------ 初始化积分规则 ------");
        let res = this.integralRuleBak;
        if (res && res.base && res.base.discount) {
            let info = res.base.discount;
            this.integralRule.enable = res.base.status == 1;
            this.integralRule.oneIntegralForMoney = 1 / info.integral;
            let maxUseIntegral = 0;
            if (!info.limitPrice) {
                if (info.limitType == 1)
                    info.limitPrice = this.orderInfo.paidFee;
                else if (info.limitType == 2)
                    info.limitPrice = 100;
            }
            if (info.limitType == 1) {
                this.integralRule.limitPrice = info.limitPrice.toFixed(2) + "元";
                maxUseIntegral = info.limitPrice / this.integralRule.oneIntegralForMoney;
            }
            else if (info.limitType == 2) {
                this.integralRule.limitPrice = info.limitPrice + '%';
                maxUseIntegral = (this.orderInfo.paidFee - this.discount.totalDiscount) * (info.limitPrice / 100) / this.integralRule.oneIntegralForMoney;
            }
            maxUseIntegral = Math.ceil(maxUseIntegral);
            if (this.memberInfo.integral < maxUseIntegral) {
                maxUseIntegral = this.memberInfo.integral;
            }
            if ((maxUseIntegral * this.integralRule.oneIntegralForMoney) > (this.orderInfo.paidFee - this.discount.totalDiscount)) {
                maxUseIntegral = (this.orderInfo.paidFee - this.discount.totalDiscount) / this.integralRule.oneIntegralForMoney;
            }
            this.integralRule.maxUseIntegral = parseInt(maxUseIntegral + "");
            this.integralRule.maxExChangeMoney = +(maxUseIntegral * this.integralRule.oneIntegralForMoney).toFixed(2);
            if (info.limitType == 1) {
                if (this.integralRule.maxExChangeMoney > info.limitPrice) {
                    this.integralRule.maxExChangeMoney = +info.limitPrice.toFixed(2);
                }
            }
            else if (info.limitType == 2) {
                let maxExMoney = (this.orderInfo.paidFee - this.discount.totalDiscount) * (info.limitPrice / 100);
                if (this.integralRule.maxExChangeMoney > maxExMoney) {
                    this.integralRule.maxExChangeMoney = +maxExMoney.toFixed(2);
                }
            }
        }
        else {
            this.integralRule.enable = false;
            this.integralRule.maxUseIntegral = 0;
            this.integralRule.oneIntegralForMoney = 0;
        }
    }
    UseOrUnUseCoupon(coupon) {
        let that = this;
        let oldUsed = coupon.isUsed;
        if (!coupon.isUsed) {
            let orderTotalAmount = that.orderInfo.paidFee - that.discount.totalDiscount;
            if (orderTotalAmount - coupon.price < 0) {
                return { canUse: false, message: "请选择优惠金额少点的券" };
            }
            let checkRes = that.CheckCanUseCoupon(coupon);
            if (checkRes.canUse) {
                if (coupon.voucherType == 1) {
                    coupon.isUsed = true;
                    that.discount.item.orderCoupon.data.push(coupon);
                    that.discount.item.orderCoupon.totalAmount += coupon.price;
                }
                else if (coupon.voucherType == 2) {
                    coupon.isUsed = true;
                    console.log("优惠券----", coupon.name, coupon);
                    let thisCouponIsUsed = false;
                    for (let index = 0; index < coupon.products.length; index++) {
                        const product = coupon.products[index];
                        let orderPros = [];
                        if (product.scaleId)
                            orderPros = that.orderInfo.products.filter((p) => p.productId == product.productId && p.scaleId == product.scaleId);
                        else
                            orderPros = that.orderInfo.products.filter((p) => p.productId == product.productId);
                        if (orderPros && orderPros.length > 0) {
                            for (let proIndex = 0; proIndex < orderPros.length; proIndex++) {
                                const orderPro = orderPros[proIndex];
                                let unitPrice = Number(orderPro.paidFee) / orderPro.cnt;
                                if (unitPrice < coupon.price) {
                                    continue;
                                }
                                let canDisCount = orderPro.cnt;
                                if (that.orderInfo.freePros) {
                                    let orderFreePros = that.orderInfo.freePros.filter((p) => p.detailId == orderPro.detailId);
                                    if (orderFreePros.length > 0) {
                                        orderFreePros.forEach((e) => {
                                            canDisCount -= e.cnt;
                                        });
                                    }
                                }
                                let hasThisCouponCount = 0;
                                if (orderPro.discount && canDisCount > 0) {
                                    for (const key in orderPro.discount) {
                                        if (orderPro.discount.hasOwnProperty(key)) {
                                            const discount = orderPro.discount[key];
                                            if (discount.type == 5) {
                                                hasThisCouponCount++;
                                            }
                                        }
                                    }
                                }
                                if (hasThisCouponCount >= canDisCount || canDisCount < 1) {
                                    continue;
                                }
                                let addDisFlag = that.AddProDiscount(orderPro, hasThisCouponCount, coupon.price, "proCoupon", { serialNumber: coupon.serialNumber });
                                if (addDisFlag) {
                                    let tempCoupon = Object.assign(coupon);
                                    tempCoupon.detailInfo = {
                                        detailId: orderPro.detailId,
                                        index: hasThisCouponCount
                                    };
                                    that.discount.item.proCoupon.data.push(tempCoupon);
                                    console.log("Element", orderPro);
                                    coupon.isUsed = true;
                                    thisCouponIsUsed = true;
                                    break;
                                }
                            }
                            if (thisCouponIsUsed)
                                break;
                        }
                        else {
                            coupon.isUsed = false;
                        }
                    }
                    if (!thisCouponIsUsed) {
                        coupon.isUsed = false;
                    }
                    console.log("优惠券", this.discount.item.proCoupon);
                }
                else {
                    return ({ canUse: false, message: "无法确定券的来源，无法使用。" });
                }
            }
            else {
                return checkRes;
            }
        }
        else {
            coupon.isUsed = false;
            let couponKey = "orderCoupon";
            if (coupon.voucherType == 2) {
                couponKey = "proCoupon";
                for (let index = 0; index < coupon.products.length; index++) {
                    const product = coupon.products[index];
                    let orderPros = this.orderInfo.products.filter((p) => p.productId == product.productId && p.scaleId == product.scaleId);
                    if (orderPros && orderPros.length > 0) {
                        let isBreak = false;
                        for (let proIndex = 0; proIndex < orderPros.length; proIndex++) {
                            const orderPro = orderPros[proIndex];
                            let delKey = null;
                            if (orderPro.discount) {
                                for (const key in orderPro.discount) {
                                    if (orderPro.discount.hasOwnProperty(key)) {
                                        const discount = orderPro.discount[key];
                                        if (discount.type == 5 && discount.serialNumber == coupon.serialNumber) {
                                            delKey = key;
                                        }
                                    }
                                }
                            }
                            if (delKey) {
                                isBreak = true;
                                delete orderPro.discount[delKey];
                                this.InitProDiscount();
                                break;
                            }
                        }
                        if (isBreak)
                            break;
                    }
                }
            }
            let spliceIndex = 0;
            for (let index = 0; index < this.discount.item[couponKey].data.length; index++) {
                const element = this.discount.item[couponKey].data[index];
                if (element.serialNumber === coupon.serialNumber) {
                    spliceIndex = index;
                }
            }
            this.discount.item[couponKey].data.splice(spliceIndex, 1);
            this.discount.item[couponKey].totalAmount -= coupon.price;
        }
        this.InitIntegralRule();
        this.CalculationTotalDiscount();
        return { canUse: oldUsed != coupon.isUsed };
    }
    UseOrUnUseIntegral() {
        this.discount.item.integral.isUsed = !this.discount.item.integral.isUsed;
        if (this.discount.item.integral.isUsed) {
            let discountAmount = this.integralRule.maxUseIntegral * this.integralRule.oneIntegralForMoney;
            if (discountAmount > this.integralRule.maxExChangeMoney) {
                discountAmount = this.integralRule.maxExChangeMoney;
            }
            console.log(discountAmount);
            this.discount.item.integral.totalAmount = discountAmount;
            this.discount.item.integral.integralCount = this.integralRule.maxUseIntegral;
        }
        else {
            this.discount.item.integral.totalAmount = 0;
            this.discount.item.integral.integralCount = 0;
        }
        this.CalculationTotalDiscount();
    }
    GetPayData() {
        let payData = {
            ordersId: this.orderInfo.ordersId,
            payType: {},
            brandId: "#",
            discount: {
                cop: {},
                zhe: 0,
                zheTip: "",
                zhengMaling: 0,
                otherDiscount: undefined,
                daijin: undefined
            },
            memberId: this.orderInfo.memberId,
            molinRule: 0
        };
        console.log("获取支付参数", this);
        let discounts = {};
        if (this.discount.item.fullOrder.totalAmount > 0) {
            payData.discount.zhe = this.discount.item.fullOrder.totalAmount;
        }
        this.orderInfo.products.forEach((element) => {
            let detailDis = [];
            if (this.discount.item.fullOrder.totalAmount <= 0 || (this.discount.item.fullOrder.totalAmount > 0 && this.discount.item.fullOrder.type == 2)) {
                if (element.discount) {
                    for (const key in element.discount) {
                        if (element.discount.hasOwnProperty(key)) {
                            const discount = element.discount[key];
                            let oldDis = detailDis.filter((p) => p.name === discount.name && discount.type != "proCoupon" && discount.type != "limitPro")[0];
                            if (oldDis) {
                                oldDis.cnt++;
                            }
                            else {
                                let disObj = { name: discount.name, cnt: 1, detailId: element.detailId, type: 0 };
                                if (discount.type == "member") {
                                    disObj.type = 1;
                                }
                                else if (discount.type == "specialPro") {
                                    disObj.type = 3;
                                    disObj.aviType = discount.aviType;
                                    disObj.disinfo = {
                                        "base": {
                                            "name": "会员特价",
                                            "rule": {
                                                "type": "limit",
                                                "val": ((element.paidFee / element.cnt) - discount.amount).toFixed(2)
                                            }
                                        }
                                    };
                                }
                                else if (discount.type == "reducePro" || discount.type == "limitPro" || discount.type == "discountPro") {
                                    disObj.id = discount.id;
                                    disObj.type = 3;
                                }
                                else if (discount.type == "proCoupon") {
                                    disObj.serialNumber = discount.serialNumber;
                                    disObj.type = 4;
                                }
                                detailDis.push(disObj);
                            }
                        }
                    }
                }
            }
            if (this.orderInfo.freePros && this.orderInfo.freePros.length > 0) {
                let freePros = this.orderInfo.freePros.filter((p) => p.detailId == element.detailId);
                if (freePros && freePros.length > 0) {
                    freePros.forEach((freePro) => {
                        let oldDis = detailDis.filter(p => p.name === "赠菜")[0];
                        if (oldDis) {
                            oldDis.cnt += element.cnt;
                        }
                        else {
                            let disObj = {
                                name: "赠菜",
                                cnt: freePro.cnt,
                                detailId: freePro.detailId,
                                type: 3,
                                disinfo: {
                                    "base": {
                                        "name": "赠菜",
                                        "rule": {
                                            "type": "limit",
                                            "val": 0
                                        }
                                    }
                                }
                            };
                            detailDis.push(disObj);
                        }
                    });
                }
            }
            if (detailDis.length > 0)
                discounts[element.detailId] = detailDis;
        });
        if (this.discount.item.integral.isUsed) {
            payData.discount.otherDiscount = {
                integral: {
                    fee: +this.discount.item.integral.totalAmount.toFixed(2),
                    subIntegral: this.discount.item.integral.integralCount
                }
            };
        }
        if (this.discount.item.orderCoupon.totalAmount > 0) {
            let daiJin = [];
            for (let index = 0; index < this.discount.item.orderCoupon.data.length; index++) {
                const element = this.discount.item.orderCoupon.data[index];
                daiJin.push({ serialNumber: element.serialNumber });
            }
            payData.discount.daijin = daiJin;
        }
        if (this.storeInfo.malingRules != 0 && this.discount.item.moling.totalAmount > 0) {
            payData.discount.zhengMaling = +this.discount.item.moling.totalAmount.toFixed(2);
        }
        payData.discount.cop = discounts;
        console.log(JSON.stringify(payData));
        return payData;
    }
}
export class DiscountService extends BaseApplicationService {
    constructor() {
        super();
        this._activeService = ApplicationServiceFactory.GetServiceInstance("IActivityService");
        this._productService = ApplicationServiceFactory.GetServiceInstance("IProductService");
        this._couponService = ApplicationServiceFactory.GetServiceInstance("ICouponService");
        this._memberService = ApplicationServiceFactory.GetServiceInstance("IMemberService");
    }
    GetDiscountInstance(orderInfo) {
        return this.Init(orderInfo);
    }
    Init(orderInfo) {
        let that = this;
        if (orderInfo.memberId == "0") {
            return this.Request.All([this.GetSpecialPrice(), this.GetProsDiscount(), this.GetCouponRule(), this.GetIntegralRule()])
                .then((res) => {
                console.log("初始化结果1", res);
                let specialOfferData = res[0];
                let prosDiscountData = res[1];
                let couponRule = res[2];
                let integralRule = res[3];
                return new DiscountInfo(this.GetStoreInfo(), orderInfo, specialOfferData, prosDiscountData, couponRule, null, integralRule);
            });
        }
        else {
            return this.Request.All([this.GetSpecialPrice(), this.GetProsDiscount(), this.GetCouponRule(), this.GetOrderMemberInfo(orderInfo.memberId), this.GetIntegralRule()])
                .then((res) => {
                console.log("初始化结果2", res);
                let specialOfferData = res[0];
                let prosDiscountData = res[1];
                let couponRule = res[2];
                let memberInfo = res[3];
                let integralRule = res[4];
                console.log("integralRule", integralRule);
                return new DiscountInfo(this.GetStoreInfo(), orderInfo, specialOfferData, prosDiscountData, couponRule, memberInfo, integralRule);
            });
        }
    }
    GetSpecialPrice() {
        return this._activeService.GetSpecialOffer();
    }
    GetProsDiscount() {
        return this._productService.GetProductDiscount();
    }
    GetCouponRule() {
        return this._couponService.GetBrandCouponRule();
    }
    GetOrderMemberInfo(memberId) {
        return this._memberService.GetMemberInfoByPhoneOrMemberId(memberId);
    }
    GetIntegralRule() {
        return this._activeService.GetIntegralRule();
    }
    GetImplementsService() {
        return "IDiscountService";
    }
}
//# sourceMappingURL=DiscountService.js.map