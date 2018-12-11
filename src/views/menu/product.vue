<template>
  <div class="product">
    <div class="product-imgbox">
      <img @click="gotoDetail()" v-if="product.picImg" :src="product.picImg">
      <img @click="gotoDetail()" v-else src="../../assets/img/food.png">
    </div>
    <div class="product-message">
      <div class="m-name">
        <span class="m-stock" v-if="!product.soldout && product.stock">
          <span class="small-text">剩{{ product.stock }}份</span>
        </span>
        {{product.base.name}}
      </div>
      <!-- <div class="m-price">{{product.base.scales[0].price}}</div> -->
      <div class="product-cal">
        <div class="minus" v-if="num[0] && num[0].count > 0" @click="minusProduct(product)">
          <img src="../../assets/img/sh/theme/@2x/normal/minus.png">
        </div>
        <div class="p-cal-num" v-if="num[0] && num[0].count > 0">{{num[0] && num[0].count}}</div>
        <div class="add" @click="addProduct(product)">
          <img src="../../assets/img/sh/theme/@2x/normal/add.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import add from "../../public_comp/add";

export default {
  name: "product",
  components: {
    add
  },
  data() {
    return {
      shopCart: []
    };
  },
  mounted() {
    this.Cache.AddCache({ key: "Select_Components", data: null, timeSpan: 0 });
    this.Cache.AddCache({
      key: "Select_SelfHelp_Components",
      data: null,
      timeSpan: 0
    });
  },
  methods: {

    gotoDetail() {
      this.$router.push({
        path: `/menu/product/detail?id=${this.product.id}`
      });
    },
    minusProduct(product) {
      if(product.type == 'taocan' || product.type == 'zixuan') {
        this.toast('该餐品请到购物车删除。')
      }
      else if (product.type == 'product') {
        let pAttr = product.base.components;
        let pscale = product.base.scales;
        if (!pAttr.length && pscale.length === 1) {
          let d_product = this.dslProduct(product);
          this.Service.IShoppingCartService.DelProduct(d_product);
        }
        else {
          this.toast('该餐品请到购物车删除。')
        }
      }
    },
    addProduct(product) {
      if (product.type == "taocan") {
        let d_product = this.dslProduct(product);
        this.Service.IShoppingCartService.AddProduct(d_product);
        console.log("原产品", product);
        console.log("固定套餐添加成功！");
        console.log("构建后", d_product);
      }
      // 普通商品 product
      else if (product.type == "product") {
        let pAttr = product.base.components;
        let pscale = product.base.scales;

        // 没有餐品属性 并且 没有餐品规格 就直接下单
        if (!pAttr.length && pscale.length === 1) {
          // dslProduct 转换函数 转换后加入到购物车里

          let d_product = this.dslProduct(product);
          this.Service.IShoppingCartService.AddProduct(d_product);
        }
        // 展示口味窗口
        else {
          this.$store.state.Kind.isShow = true;
          this.Cache.UpdateCache({ key: "Select_Components", data: product });
          console.log("普通餐品进入口味窗口成功！");
        }
      }
      // 自选
      else if (product.type == "zixuan") {
        this.$store.state.Kind.selfHelp_isShow = true;
        this.Cache.UpdateCache({
          key: "Select_SelfHelp_Components",
          data: product
        });
        console.log(product);
      }

      let shopCart = this.Service.IShoppingCartService.GetShoppingCartInfo();
      console.log(product, shopCart);
    }
  },
  props: {
    product: {
      type: Object
    },
    num: Array
  }
};
</script>
<style lang="sass">
.product
  position: relative;
  display: inline-block;
  width: 6.85rem;
  margin-bottom: 10px;
  margin-right: 0.4rem;
  vertical-align: top;
  .product-imgbox
    position: relative;
    width: 6.85rem;
    height: 6rem;
    overflow: hidden;
    text-align: center;
    background-color: #FFF;
    border-radius: 4px 4px 0px 0px;
    img
      width: 100%;
      height: 100%;
  .product-message
    width: 100%;
    height: 94px;
    box-sizing: border-box;
    background-color: #FFF;
    border: 1px solid #F5F5F5;
    .m-name
      font-size: 14px;
      overflow: hidden;
      display: -webkit-box;
      height: 42px;
      padding: 4px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-weight: bold;
      text-overflow: ellipsis;
      color: #666;
    .m-add
      width: 22px
      height: 22px
      right: 8px;
      bottom: 6px;
      position: absolute;
      img
        width: 100%
        height: 100%
    .product-cal
      position: absolute;
      bottom: 10px;
      right: 10px;
      div
        display: inline-block;
        margin-left: 10px;
      .add 
        width: 18px;
        height: 18px;
        img
          width: 100%;
          height: 100%;
      .minus 
        width: 18px;
        height: 18px;
        img
          width: 100%;
          height: 100%;
      .p-cal-num
        font-size: 16px;
        position: relative;
        bottom: 3px;
        
      
</style>

