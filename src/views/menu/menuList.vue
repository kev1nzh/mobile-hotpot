<template>
  <div class="menuList">
    <plist/>
    <div class="menu-main">
      <menu-left-bar v-if="isProductData" :types="productData"
                     :idx="idx"
                     :scrollMain="scrollMainRight"
                     :scrollTypes="scrollTypesRight"
                     @getData="getData"/>
      <menu-right-product v-if="isProductData" :productData="productData"
                          :idx="idx"
                          :scrollMain="scrollMainLeft"
                          :scrollTypes="scrollTypesLeft"
                          @getData="getData"/>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import plist from "./plist";
import menuLeftBar from "./menuLeftBar";
import menuRightProduct from "./menuRightProduct";
export default {
  name: "menuList",
  components: {
    plist,
    menuLeftBar,
    menuRightProduct
  },
  data() {
    return {
        productData: [],
        isProductData:false,
        types: [],

        idx:0,
        scrollMainRight:{},
        scrollMainLeft:{},
        scrollTypesLeft:[],
        scrollTypesRight:[],
    };
  },
    // watch: {
        // idx(index) {
        //     console.log("index",index);
        //     let domRight = this.scrollTypesRight[index].dom;
        //     let domLeft = this.scrollTypesLeft[index].dom;
        //     this.scrollMainLeft.scrollToElement(domLeft, 100, false, true);
        //     this.scrollMainRight.scrollToElement(domRight, 0, false, false);
        // }
    // },
  created() {
    this.init();
  },
  methods: {
    // ***********************初始化函数***********************
    init() {
      let _this = this;
      _this.Indicator.open({
        text: '加载中...',
        spinnerType: 'triple-bounce'
      });
      Promise.all([
        _this.Service.IBrandService.GetBrandStores(), // 获取商家信息
        _this.Service.IBrandService.GetBrandGrades(), //获取商家会员等级
        _this.Service.IProductService.GetStoreProducts({ dataType: 1 }), //获取所有商品
        _this.Service.IProductTypeService.GetBrandProductTypes(), //获取types
        // _this._configCenter.SetSysInfo()  
      ])
      .then(res => {
        let shopcart = this.Cache.GetCache({key: 'ShoppingCart'});
        let products = res[2];
        let types = res[3].reverse();
        let productMap = {};
        let zixuan = [];
        let taocan = [];
        // 种类转成map
          for (let type of types) {
              productMap[type.id] = type;
              productMap[type.id].products = [];
              for (let product of products) {
                  if (type.id == product.base.category.id) {
                      let picImgKey = product.base.picInfo.default;
                      let picImg = product.base.picInfo.items[picImgKey];

                      if(picImg && picImg.url) {
                          product.picImg = picImg.url;
                      }
                      else {
                          product.picImg = null;
                      }
                      productMap[type.id].products.push(product);
                  }
              }

          }
          let productMapData = [];
          for (let item in productMap){
              if(productMap[item] && productMap[item].products && productMap[item].products.length){
                  productMapData.push(productMap[item]);
              }
          }
        _this.productData = productMapData;
        _this.types = types;
        _this.Indicator.close();
          _this.isProductData = true;
      })
    },
    // ***********************交互函数***********************
      getData:function(obj){
          this[obj.key] = obj.data;
      },
      scrollKey(curr) {
          this.currItem = curr;
      },
      updateScrollArr:function (arr) {
          this.scrollArr = arr;
      },
      updateKey:function (idx) {
          this.currItem = this.scrollArr[idx];
      },
      updateTypeTitle:function (arr) {
          this.scrollTypeArr = arr;
      }
  }
};
</script>
<style lang="sass">
.menuList
  position: absolute
  top: 5.5rem
  bottom: 60px
  left: 0
  right: 0
  .menu-main
    position: absolute
    top: 4rem
    bottom: 0
    left: 0
    right: 0
</style>

