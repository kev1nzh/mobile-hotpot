import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import MintUI from 'mint-ui'
import axios from 'axios'
import moment from 'moment'
import {
    BigNumber
} from 'bignumber.js'
import {
    Toast,
    Indicator,
    MessageBox,
} from 'mint-ui';
import {
    EshineFramework
} from './framework/EshineFramework'
import {
    GlobalUrlInfo
} from './framework/core/config/ConfigCenter.js'
import {
    AxiosRequest
} from './framework/core/request/RequestFactory.js'
import {
    VueXCache
} from './framework/core/cache/Cache';




import '../src/css/init.css'
import 'mint-ui/lib/style.css'
import '../src/css/mint-ui.scss'

// modules used
Vue.use(MintUI)

// 获取href的参数
// return {Object}
let getRouterRouter = () => {
    let href = window.location.href;
    console.log(href);
    let arg = href.split("?");
    let router = {};
    if (arg.length > 1  &&  href.split("/P/")[1]) {
        router.params = href.split("/P/")[1].split(",");
        router.token = arg[1]
            .split("#")[0]
            .split("&")[0]
            .split("=")[1];
    }
    console.log(router);
    return router;

}
let getCloud = () => {
    let router = getRouterRouter();
    let cloud = {};
    console.log(router);


    if (!router.params) return;
    // 状态
    cloud.brandId = router.params[0];
    cloud.state = router.params[1];
    if (router.params[2]) {
        cloud.storeId = router.params[2];
    }
    if (router.params[3]) {
        cloud.deskId = router.params[3];
    }
    if (router.params[5]) {
        cloud.state === "7" ?
            (cloud.activeId = infos[5]) :
            (cloud.ordersIds = infos[5]);
    }
    if (router.params[6]) {
        cloud.mobile = router.params[6];
    }
    if (router.params[7]) {
        clould.increase = router.params[7];
    }
    return cloud;
}
let getBrandInfo = (cloud) => {
    let brandId = "";
    if (cloud && cloud.brandId) {
        brandId = cloud.brandId;
        localStorage.setItem("IbrandId", cloud.brandId);
        console.log("注册了");
    } else if (localStorage.getItem("IbrandId")) {
        brandId = localStorage.getItem("IbrandId");
        console.log("拿了");
    }
    return {
        brandId,
        ImplementsIBrand() {
            return true;
        }
    };
}
let getStoreInfo = (cloud) => {

    let storeId = "";
    if (cloud && cloud.storeId) {
        storeId = cloud.storeId;
        localStorage.setItem("IstoreId", cloud.storeId);
        console.log("注册了");
    } else if (localStorage.getItem("IstoreId")) {
        storeId = localStorage.getItem("IstoreId");
        console.log("拿了");
    }

    return {
        storeId,
        ImplementsIBrand() {
            return true;
        }
    };
}
let getMemberId = () => {
    let memberId = localStorage.getItem('ImemberId');
    console.log(memberId);
    if (memberId) {
        return memberId;
    } else {
        return null;
    }
}
let getToken = () => {
    let token = localStorage.getItem('Itoken');
    console.log(token);
    if (token) {
        return token;
    } else {
        return null;
    }
}


let cloud = getCloud();
let brandInfo = getBrandInfo(cloud);
let storeInfo = getStoreInfo(cloud);
let memberId = getMemberId();
let token = getToken();
// framework
let config = {
    GlobalUrlInfo: new GlobalUrlInfo({
        EsProxyUrl: "http://esproxy.eshinetest.cn/",
        CloudStoreApi: "http://cloudstoreapi.eshinetest.cn:10100/sapi/",
        CloudOrderApi: "http://ecloudorders.eshinetest.cn:10300/api/",
        SsoApi: "http://ssoapi.eshinetest.cn:10403/api/",
    }),
    Request: new AxiosRequest(axios),
    EsClient: undefined,
    Cache: new VueXCache(store),
}

console.log(cloud, brandInfo, storeInfo, memberId, token);
let framework = new EshineFramework(config);

framework.InitializationFramework({
    brandInfo: brandInfo,
    storeInfo: storeInfo,
    sysInfo: {
        memberId,
        token: {
            loginToken: "",
            token,
        }
    }
});
if(storeInfo.storeId && brandInfo.brandId) {
    framework.Service.IStoreService.GetBrandStoreinfoByApi();
}
console.log(framework);
// setting
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.moment = moment
Vue.prototype.bigNumber = BigNumber
// mint-ui
Vue.prototype.toast = Toast
Vue.prototype.Indicator = Indicator
Vue.prototype.MessageBox = MessageBox
Vue.prototype.Framework = framework
Vue.prototype.Service = framework.Service
Vue.prototype.Cache = framework.Cache
Vue.prototype.HttpRequest = framework.HttpRequest
Vue.prototype.Repository = framework.Repository

// 转换product函数
Vue.prototype.dslProduct = (product) => {
    if (!product) {
        console.error('请传入餐品');
    }
    // let cloud = store.state.Cloud.Cloud;
    // let member = framework.Cache.GetCache({key: "H5_MemberInfo"}).data;
    // console.log(product);
    // 普通餐品
    let d_product = {
        id: product.id,
        scaleId: product.scaleIdSelected ? product.scaleIdSelected : 0,
        count: 1,
        components: [],
        name: product.base.name,
        scaleName: product.scaleNameSelected ? product.scaleNameSelected : '',
        price: (product.base.scales && product.base.scales.length) ? product.base.scales[0].price : product.base.price,
        type: product.type,
        limit: 0,
        products: []
    };

    // scaleName
    // 普通商品
    if (product.base.unit.length === 1) {
        d_product.scaleName = product.base.unit[0].label;
    }
    // 有规格
    else if (product.scaleSelected) {
        d_product.scaleName = product.scaleSelected.name
    }

    // compontents
    if (product.componentsSelected) {
        d_product.components = product.componentsSelected;
    } else {
        d_product.components = [];
    }
    // subProduct 自选
    if (product.base.productsList) {
        d_product.products = product.base.productsList.map(e => {
            return {
                id: e.id,
                count: e.cnt,
                type: e.type,
                scaleId: e.scaleId,
                scaleName: e.exinfo.scaleName,
                name: e.exinfo.name,
                components: e.components,
            }
        })
    }
    // zixuanProducts
    if (product.zixuanProductsSelected) {
        d_product.products = product.zixuanProductsSelected;
    }
    // subProducts
    // let proList = product.base.productsList;
    // let zxList = product.base.zixuanProducts;
    // if (proList) {
    //   d_product.subProducts = proList.map(e => {
    //     return dslProduct(e);
    //   })
    // }
    // else if (zxList) {
    //   d_product.subProducts = proLzxListist.map(e => {
    //     return dslProduct(e);
    //   })
    // }
    // else {
    //   return d_product;
    // }
    return d_product;

}




// start!!!!
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')