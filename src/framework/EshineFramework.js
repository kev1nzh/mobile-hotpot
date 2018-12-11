import { MemoryCache } from "./core/cache/Cache";
import { ConfigCenter } from "./core/config/ConfigCenter";
import { BrandInfo } from "./core/entities/brands/BrandInfo";
import { RepositoryFactory } from "./core/repository/RepositoryFactory";
import { MemberService } from "./application/members/MemberService";
import { ApplicationServiceFactory } from "./application/ApplicationServiceFactory";
import { ProductService } from "./application/products/ProductService";
import { Product } from "./core/entities/products/Product";
import { BrandService } from "./application/brands/BrandService";
import { ProductType } from "./core/entities/productTypes/ProductType";
import { ProductTypeService } from "./application/productTypes/ProductTypeService";
import { ActivityService } from "./application/activities/ActivityService";
import { ShoppingCartService } from "./application/shoppingCarts/ShoppingCartService";
import { ProductDto } from "./application/shoppingCarts/dtos/ProductDto";
import { OrderService } from "./application/orders/OrderService";
import { RefundProduct } from "./core/entities/products/RefundProduct";
import { FreeProduct } from "./core/entities/products/FreeProduct";
import { IntegralRule } from "./core/entities/activities/IntegralRule";
import { LimitSaleProduct } from "./core/entities/products/LimitSaleProduct";
import { Order } from "./core/entities/orders/Order";
import { DiscountService } from "./application/discounts/DiscountService";
import { CouponRule } from "./core/entities/coupons/CouponRule";
import { CouponService } from "./application/coupons/CouponService";
import { StoreInfo } from "./core/entities/stores/StoreInfo";
import { StoreService } from "./application/stores/StoreService";
import { OrderLog } from "./core/entities/behaviorLogs/OrderLog";
export class EshineFramework {
    constructor(config) {
        this._configCenter = ConfigCenter.GetInstance();
        this.HttpRequest = config.Request;
        this._configCenter.SetRequestInstance(config.Request);
        this._configCenter.SetGlobalUrl(config.GlobalUrlInfo);
        let busCache = config.Cache ? config.Cache : MemoryCache.GetCacheInstance();
        this._configCenter.SetCacheInstance(busCache);
        this.Cache = busCache;
        if (config.EsClient)
            this._configCenter.SetEsClientInstance(config.EsClient);
        this.InitializationRepository();
        this.Service = {};
        this.InitializationServices();
        this.InitializationNchanSubscriber();
    }
    InitializationNchanSubscriber() {
    }
    InitializationRepository() {
        RepositoryFactory.CreateRepositoryInstance(StoreInfo);
        RepositoryFactory.CreateRepositoryInstance(ProductType);
        RepositoryFactory.CreateRepositoryInstance(Product);
        RepositoryFactory.CreateRepositoryInstance(LimitSaleProduct);
        RepositoryFactory.CreateRepositoryInstance(RefundProduct);
        RepositoryFactory.CreateRepositoryInstance(FreeProduct);
        RepositoryFactory.CreateRepositoryInstance(IntegralRule);
        RepositoryFactory.CreateRepositoryInstance(CouponRule);
        RepositoryFactory.CreateRepositoryInstance(Order);
        RepositoryFactory.CreateRepositoryInstance(OrderLog);
    }
    InitializationServices() {
        let storeService = ApplicationServiceFactory.RegisterServiceInstance(StoreService);
        this.Service["IStoreService"] = storeService;
        let productTypeService = ApplicationServiceFactory.RegisterServiceInstance(ProductTypeService);
        this.Service["IProductTypeService"] = productTypeService;
        let couponService = ApplicationServiceFactory.RegisterServiceInstance(CouponService);
        this.Service["ICouponService"] = couponService;
        let memberService = ApplicationServiceFactory.RegisterServiceInstance(MemberService);
        this.Service["IMemberService"] = memberService;
        let productService = ApplicationServiceFactory.RegisterServiceInstance(ProductService);
        this.Service["IProductService"] = productService;
        let brandService = ApplicationServiceFactory.RegisterServiceInstance(BrandService);
        this.Service["IBrandService"] = brandService;
        let activityService = ApplicationServiceFactory.RegisterServiceInstance(ActivityService);
        this.Service["IActivityService"] = activityService;
        let shoppingCartService = ApplicationServiceFactory.RegisterServiceInstance(ShoppingCartService);
        this.Service["IShoppingCartService"] = shoppingCartService;
        let orderService = ApplicationServiceFactory.RegisterServiceInstance(OrderService);
        this.Service["IOrderService"] = orderService;
        let discountService = ApplicationServiceFactory.RegisterServiceInstance(DiscountService);
        this.Service["IDiscountService"] = discountService;
    }
    InitializationFramework(data) {
        if (data.brandInfo)
            this._configCenter.SetBrandInfo(data.brandInfo);
        if (data.storeInfo) {
            if (data.storeInfo._id) {
                let sysInfo = this._configCenter.GetSysInfo();
                if (sysInfo && sysInfo.token) {
                    let storeService = this.Service.IStoreService;
                    storeService.GetBrandStoreinfoByApi();
                }
            }
            this._configCenter.SetStoreInfo(data.storeInfo);
        }
        if (data.sysInfo)
            this._configCenter.SetSysInfo(data.sysInfo);
    }
    TestStore() {
        let storeService = this.Service.IStoreService;
        storeService.GetBrandStoreInfo().then((res) => {
            console.log("门店信息", res);
        });
    }
    TestOrder() {
        let orderId = "52520ea2cf884fb7b6baf69eddb577e2";
        let orderService = this.Service.IOrderService;
        orderService.GetOrderDetail(orderId).then((res) => {
            console.log("订单数据", res);
        });
    }
    Test() {
        let brandInfo = new BrandInfo(100224, "上海壹向测试");
        this._configCenter.SetBrandInfo(brandInfo);
        let storeInfo = new StoreInfo(300881, "测试数据门店");
        this._configCenter.SetStoreInfo(storeInfo);
        this._configCenter.UpdateBrandInfo(new BrandInfo(100224, "胡莱莱"));
        let globalUrlInfo = this._configCenter.GetGlobalUrl();
        let url = globalUrlInfo.CloudStoreApi + "IStores";
        let reqData = { filter: { "where": { "brandId": 100224 } } };
        this.HttpRequest.Request("GET", url, reqData).then(res => {
            console.log("单个请求", res);
        });
        let that = this;
        let req = function () {
            return that.HttpRequest.Request("GET", url, reqData).then(res => {
                return res;
            });
        };
        let req2 = req;
        this.HttpRequest.All([req(), req2()]).then(res => {
            console.log("多次请求", res);
        });
    }
    TestMembers() {
        let memberService = this.Service.IMemberService;
        memberService.CheckMemberPhone("13033182279").then((res) => {
            console.log("13033182279", res);
        });
        memberService.CheckMemberPhone("13033182267").then((res) => {
            console.log("13033182267", res);
        });
        memberService.MemberLoginByCode("13033182267", "2485").then((res) => {
            console.log("验证吗2", res);
        });
    }
    TestProduct() {
        this.Service.IProductService.GetStoreProducts({ dataType: 1 }).then((res) => {
            console.log("商品返回数据", res, res.filter((p) => p.type == "zixuan"));
        });
        this.Service.IActivityService.GetRechargeForCoupon().then((res) => {
            console.log('充值升级', res);
        });
    }
    TestProductType() {
        this.Service.IProductTypeService.GetBrandProductTypes().then((res) => {
            console.log("商品类型", res);
        });
    }
    TestActivity() {
        this.Service.IActivityService.GetSpecialOffer().then((res) => {
            console.log("会员特价", res);
        });
        this.Service.IActivityService.GetRechargeForCoupon().then((res) => {
            console.log("充值送券", res);
        });
        this.Service.IActivityService.GetRechargeForCash().then((res) => {
            console.log("充值返现", res);
        });
        this.Service.IActivityService.GetCouponPackage().then((res) => {
            console.log("优惠券礼包", res);
        });
        this.Service.IActivityService.GetIntegralRule().then((res) => {
            console.log("积分规则", res);
        });
    }
    TestShoppingCart() {
        let shoppingCartService = this.Service.IShoppingCartService;
        shoppingCartService.InitShoppingCart({ deskId: "A2", deskName: "存在2", memberId: 2068422, person: 5 });
        let product = new ProductDto({
            id: "069878695771477f8b05ac591baeba88",
            type: "zixuan",
            count: 5,
            scaleId: "0",
            subProducts: [
                new ProductDto({
                    id: "166f3cde71f147189d5f6376a613290e",
                    scaleId: "0",
                    count: 1,
                    groupId: 0,
                    groupName: "哈哈哈",
                }),
                new ProductDto({
                    id: "c3b637a988834d8d828265b0fb4bc137",
                    scaleId: "0",
                    count: 1,
                    groupId: 1,
                    groupName: "哈哈哈1",
                    components: [{
                            "id": "1be1814598af458d990d1f558b2d490b",
                            "items": [{
                                    "id": "fe04f9602a2a4eb5811cd2143712c818",
                                    count: 1
                                }]
                        }]
                }),
                new ProductDto({
                    id: "a62c7f636e19408e8e43eb4d5a5afb0b",
                    scaleId: "0",
                    count: 1,
                    type: "product",
                    name: "吊龙",
                    scaleName: "中份",
                    groupId: 2,
                    groupName: "哈哈哈2",
                }),
                new ProductDto({
                    id: "aced302492b54f808e1449863f15a82a",
                    scaleId: "0",
                    count: 1,
                    groupId: 2,
                    groupName: "哈哈哈2",
                }),
            ]
        });
        shoppingCartService.AddProduct(product);
        let product2 = new ProductDto({
            id: "12ffe0827df64dd18806fb905fa3298c",
            scaleId: "0",
            count: 5
        });
        shoppingCartService.AddProduct(product2);
        let saveData = shoppingCartService.GetSaveOrderData();
        console.log(saveData);
        let orderService = this.Service.IOrderService;
        console.log(this);
    }
    TestDiscount() {
        let orderId = "37438651cb1d4f29960036001342e30d";
        let orderService = this.Service.IOrderService;
        let discountService = this.Service.IDiscountService;
        orderService.GetOrderDetail(orderId).then((res) => {
            console.log("订单数据", res);
            discountService.GetDiscountInstance(res).then((ss) => {
                console.log("优惠数据", ss);
                ss.UseOrUnUseCoupon(ss.memberCoupons[0]);
                let data = ss.GetPayData();
                data.payType = {
                    cash: res.paidFee
                };
            });
        });
    }
}
//# sourceMappingURL=EshineFramework.js.map