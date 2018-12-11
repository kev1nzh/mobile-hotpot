import { BaseApplicationService } from "../BaseApplicationService";
import { Product } from "../../core/entities/products/Product";
import { EsQuery, EsQueryDsl } from "../../core/repository/dtos/EsQuery";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { GetCacheInput } from "../../core/cache/dtos/GetCacheInput";
import { AddCacheDto } from "../../core/cache/dtos/AddCacheDto";
import { LimitSaleProduct } from "../../core/entities/products/LimitSaleProduct";
export class ProductService extends BaseApplicationService {
    constructor() {
        super();
        this._allProductsCacheKey = "AllProducts";
        this._canSaleProductsCacheKey = "CanSaleProducts";
        this._discountProductsCacheKey = "DiscountProducts";
        this._extraProductsCacheKey = "ExtraProducts";
        this._rProduct = RepositoryFactory.GetRepositoryInstance(Product);
        this._rLimitProduct = RepositoryFactory.GetRepositoryInstance(LimitSaleProduct);
        this.Cache.AddCache(new AddCacheDto(this._allProductsCacheKey, null, 0));
        this.Cache.AddCache(new AddCacheDto(this._canSaleProductsCacheKey, null, 1000 * 60 * 120));
        this.Cache.AddCache(new AddCacheDto(this._extraProductsCacheKey, null, 1000 * 60 * 120));
        this.Cache.AddCache(new AddCacheDto(this._discountProductsCacheKey, null, 1000 * 60 * 30));
    }
    GetBrandAllProducts(data) {
        let query = new EsQuery({
            Filter: {
                storeId: "all",
                type: ["product", "zixuan", "taocan"],
                brandId: "#"
            },
            Size: 1000
        });
        let that = this;
        let getCacheInput = new GetCacheInput(this._allProductsCacheKey, function () {
            return that._rProduct.GetAll(query).then((res) => {
                let data = { list: [], map: {} };
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];
                    if (element.base && element.base.category) {
                        if (element.base && element.base.category) {
                            data.list.push(element);
                            data.map[element.id] = element;
                        }
                    }
                }
                return data;
            });
        });
        return this.Cache.GetCacheAsync(getCacheInput).then((res) => {
            if (!data.dataType || data.dataType == 0)
                return res.map;
            return res.list;
        });
    }
    GetStoreProducts(data) {
        let that = this;
        let getCacheInput = new GetCacheInput(this._canSaleProductsCacheKey, function () {
            let storeInfo = that.GetStoreInfo();
            let storeKey = `storeIds.${storeInfo.storeId}`;
            let storFilterObj = {};
            storFilterObj[storeKey] = true;
            let date = new Date();
            let now = date.getTime();
            let todayWeek = date.getDay() === 0 ? 7 : date.getDay();
            let limitQuery = new EsQuery({
                Filter: {
                    brandId: "#",
                    storeId: "#"
                },
                Size: 1000
            });
            let productDsl = new EsQueryDsl({
                Query: {
                    "and": [
                        { "term": { "brandId": "#" } },
                        {
                            or: [
                                {
                                    "range": {
                                        "base.salesTime.startDate": {
                                            "lt": now
                                        }
                                    }
                                },
                                {
                                    "term": {
                                        "base.salesTime.startDate": ""
                                    }
                                }
                            ]
                        },
                        {
                            or: [
                                {
                                    "range": {
                                        "base.salesTime.endDate": {
                                            "gt": now
                                        }
                                    }
                                },
                                {
                                    "term": {
                                        "base.salesTime.endDate": ""
                                    }
                                }
                            ]
                        },
                        {
                            or: [
                                { "term": storFilterObj },
                                {
                                    "term": {
                                        allStore: true,
                                    }
                                }
                            ]
                        }
                    ]
                },
                Size: 5000
            });
            return that.Request.All([
                that._rProduct.GetAllByDsl(productDsl),
                that._rLimitProduct.GetAll(limitQuery),
                that.GetBrandExtraProducts()
            ]).then((res) => {
                let products = res[0].data, limitProduct = res[1].data, extraProducts = res[2];
                let data = { list: [], map: {} };
                for (let index = 0; index < products.length; index++) {
                    const element = products[index];
                    if (element.base && element.base.category) {
                        let storeProductInfo = products.filter((p) => (!p.base || !p.base.category) && p.id == element.id)[0];
                        if (storeProductInfo) {
                            for (let index = 0; index < element.base.scales.length; index++) {
                                let scale = element.base.scales[index];
                                let storeScale = storeProductInfo.base.scales.filter((p) => p.id == scale.id)[0];
                                if (storeScale) {
                                    scale.price = storeScale.price;
                                }
                            }
                            element.base.salesTime = storeProductInfo.base.salesTime;
                        }
                        element.onsale = { status: 0, limit: null };
                        if (element.onsaleing) {
                            let sale = element.onsaleing.filter((p) => p.storeId == storeInfo.storeId)[0];
                            if (sale)
                                element.onsale.status = (sale.status == 1 ? 0 : 3);
                        }
                        else
                            element.onsale.status = 0;
                        if (element.base.status && element.base.status.value) {
                            element.onsale.status = element.base.status.value;
                        }
                        if (element.type == "taocan" || element.type == "zixuan") {
                            element.base.category.id = element.type == "taocan" ? "-1" : "-2";
                            element.base.price = element.base.rule.val;
                            element.base.components = null;
                            element.onsale.status = element.onsale.status == 1 ? 0 : element.onsale.status;
                            if (element.base.limit) {
                                element.onsale.limit = {
                                    sold: 0,
                                    limit: Number(element.base.limit),
                                    canSaleCount: Number(element.base.limit)
                                };
                            }
                            if (element.type == "taocan" && element.base.productsList && element.base.productsList.length > 0) {
                                element.base.productsList.forEach((taoCanPro) => {
                                    taoCanPro.components = that.CtorTaoCanProComps(taoCanPro);
                                });
                            }
                            if (element.type == "zixuan" && element.base.zixuanProducts && element.base.zixuanProducts.length > 0) {
                                element.base.zixuanProducts.forEach((zixuanPros) => {
                                    if (zixuanPros && zixuanPros.productsList && zixuanPros.productsList.length > 0) {
                                        zixuanPros.productsList.forEach((taoCanPro) => {
                                            taoCanPro.components = that.CtorTaoCanProComps(taoCanPro);
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            if (limitProduct && limitProduct.length > 0) {
                                let thisLimit = limitProduct.filter((p) => p.productId == element.id)[0];
                                if (thisLimit && thisLimit.limit > 0) {
                                    let canSaleCount = thisLimit.limit - thisLimit.sold;
                                    element.onsale.limit = {
                                        sold: thisLimit.sold,
                                        limit: thisLimit.limit,
                                        canSaleCount: canSaleCount
                                    };
                                    if (canSaleCount < 1)
                                        element.onsale.status = 1;
                                }
                            }
                            if (!element.base.price && element.base.scales && element.base.scales.length > 0) {
                                element.base.price = element.base.scales[0].price;
                            }
                        }
                        if (element.base.category.id && element.base.category.id != "" && (element.base.options && element.base.options.individualSalable)) {
                            if (element.base.salesTime.weekdays.indexOf(todayWeek + "") > -1 && element.base.category) {
                                data.list.push(element);
                                data.map[element.id] = element;
                            }
                        }
                    }
                }
                for (let index = 0; index < data.list.length; index++) {
                    const element = data.list[index];
                    if (element.type == "taocan" || element.type == "zixuan") {
                        if (element.type == "zixuan") {
                            if (element.base.zixuanProducts.length > 0) {
                                for (let index = 0; index < element.base.zixuanProducts.length; index++) {
                                    const zixuanPro = element.base.zixuanProducts[index];
                                    let count = 0;
                                    if (zixuanPro) {
                                        for (let index = 0; index < zixuanPro.productsList.length; index++) {
                                            const pro = data.map[zixuanPro.productsList[index].id];
                                            if (!pro || pro.onsale.status != 0) {
                                                if (!pro) {
                                                    zixuanPro.productsList[index].onsale = { status: 3, limit: null };
                                                }
                                                else {
                                                    zixuanPro.productsList[index].onsale = pro.onsale;
                                                }
                                                count++;
                                            }
                                            else {
                                                zixuanPro.productsList[index].onsale = { status: 0, limit: null };
                                                let scale = pro.base.scales.filter((p) => p.id == zixuanPro.productsList[index].scaleId)[0];
                                                if (scale) {
                                                    zixuanPro.productsList[index].scaleName = scale.name;
                                                }
                                            }
                                        }
                                    }
                                    if (count >= zixuanPro.productsList.length) {
                                        element.onsale.status = 1;
                                        data.map[element.id].onsale.status = 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            if (element.base.productsList.length > 0) {
                                for (let index = 0; index < element.base.productsList.length; index++) {
                                    const taocanPro = element.base.productsList[index];
                                    const pro = data.map[taocanPro.id];
                                    if (!pro || pro.onsale.status != 0) {
                                        element.onsale.status = 1;
                                        data.map[element.id].onsale.status = 1;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (extraProducts && extraProducts.length > 0) {
                    products = products.concat(extraProducts);
                    extraProducts.forEach((element) => {
                        if (element) {
                            element.base.category = { id: "-3" };
                            element.price = element.base.scales[0].price;
                            element.onsale = { status: 0, limit: null };
                            data.list.push(element);
                            data.map[element.id] = element;
                        }
                    });
                }
                return data;
            });
        });
        return this.Cache.GetCacheAsync(getCacheInput).then((res) => {
            if (!data.dataType || data.dataType == 0)
                return res.map;
            return res.list;
        });
    }
    CtorTaoCanProComps(product) {
        if (product && product.sComponents) {
            let components = [];
            for (const key in product.sComponents) {
                if (product.sComponents.hasOwnProperty(key)) {
                    const sComponent = product.sComponents[key];
                    if (sComponent.sItems) {
                        let component = { id: key, items: [] };
                        for (const itemKey in sComponent.sItems) {
                            if (sComponent.sItems.hasOwnProperty(itemKey)) {
                                const item = sComponent.sItems[itemKey];
                                component.items.push({
                                    count: item.c,
                                    id: item.id,
                                    name: item.name
                                });
                            }
                        }
                        components.push(component);
                    }
                }
            }
            return components;
        }
        return [];
    }
    GetProductDiscount() {
        let storeInfo = this.GetStoreInfo();
        let dslStoreQuery = {};
        let storeKey = "storeIds." + storeInfo.storeId;
        dslStoreQuery[storeKey] = true;
        let date = new Date();
        let dsl = new EsQueryDsl({
            Query: {
                "and": [
                    { "term": { "brandId": "#" } },
                    { "term": { "storeId": "all" } },
                    { "term": { "base.status.value": 1 } },
                    {
                        "range": {
                            "base.salesTime.endDate": {
                                "gte": date.getTime()
                            }
                        }
                    },
                    {
                        "or": [
                            { "term": { "allStore": true } },
                            { "term": dslStoreQuery }
                        ]
                    },
                    { "term": { "type": "poffer" } }
                ]
            },
            Size: 120
        });
        let that = this;
        let getCacheInput = new GetCacheInput(this._discountProductsCacheKey, function () {
            return that._rProduct.GetAllByDsl(dsl).then((res) => {
                if (res && res.data.length > 0) {
                    let result = {};
                    res.data.forEach((element) => {
                        if (element.base.productsList && element.base.productsList.length > 0) {
                            element.base.productsList.forEach((pro) => {
                                let key = pro.id + "_" + pro.scaleId;
                                let obj = {
                                    key: key,
                                    productName: pro.exinfo.name,
                                    productId: pro.id,
                                    scaleId: pro.scaleId,
                                    discountId: element.id,
                                    discountName: element.base.name,
                                    rule: element.base.rule
                                };
                                if (result[key])
                                    result[key].push(obj);
                                else
                                    result[key] = [obj];
                            });
                        }
                    });
                    return result;
                }
                return null;
            });
        });
        return this.Cache.GetCacheAsync(getCacheInput);
    }
    GetBrandExtraProducts() {
        let that = this;
        let getCacheInput = new GetCacheInput(this._extraProductsCacheKey, function () {
            let query = new EsQuery({
                Filter: {
                    brandId: "#",
                    isExtra: "true"
                }
            });
            return that._rProduct.GetAll(query).then((res) => {
                return res.data;
            });
        });
        return this.Cache.GetCacheAsync(getCacheInput);
    }
    GetImplementsService() {
        return "IProductService";
    }
}
//# sourceMappingURL=ProductService.js.map