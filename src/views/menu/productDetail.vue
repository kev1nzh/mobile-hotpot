<template>
  <div class="porduct-detail">
    <!-- <div class="product-detail-wrap"> -->
    <div class="porduct-detail-headimg">
      <!-- <img :src="product.base.picInfo.items[0].url"> -->
      <img :src="product.base.picInfo.items.length ? product.base.picInfo.items[0].url : ''">
    </div>
    <div class="porduct-detail-add">
      <span class="porduct-detail-add-name">{{product.base.name}}</span>
      <span class="porduct-detail-add-price">
        <span>￥</span>
        {{product.base.scales.length ? product.base.scales[0].price : product.base.price}}
      </span>
      <div class="porduct-detail-add-button" @click="addProduct(product)">放入购物车</div>
    </div>
    <div class="porduct-detail-content">
      <div class="porduct-detail-content-title">
        <i class="content-icon"></i>菜品详情
      </div>
      <div v-if="!product.base.intro.length">暂无详情</div>
      <div class="porduct-detail-content-body" v-else v-html="product.base.intro"></div>
    </div>
    <!-- </div> -->
    <shopcart position="fixed"/>
  </div>
</template>

<script>
// @ is an alias to /src
import shopcart from "../shopcart/shopcart";
export default {
  name: "porduct-detail",
  components: {
    shopcart
  },
  mounted() {
    this.init();
    this.getShopcart();
  },
  data() {
    return {
      shopCart: {},
      product: {
        base: {
          name: "",
          picInfo: {
            items: [
              {
                url: ""
              }
            ]
          },
          scales: [
            {
              price: 0
            }
          ],
          intro: ""
        }
      }
    };
  },
  methods: {
    getShopcart() {
      let shopCart = this.Service.IShoppingCartService.GetShoppingCartInfo();
      if (!shopCart.products) {
        shopCart.products = [];
      }
      this.shopCart = Object.assign({}, this.shopCart, shopCart);
    },
    init() {
      let id = this.$route.query.id;
      this.product = this.$store.state.CanSaleProducts.data.map[id];
      console.log(this.product);
    },
    addProduct(product) {
      this.Service.IShoppingCartService.AddProduct(product);
      console.log(this.Service.IShoppingCartService.GetShoppingCartInfo());
    }
  }
};
</script>
<style lang="sass">
.porduct-detail
  background: #F4F4F4;
  width: 100%;
  height: 100%;
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  overflow: scroll;
  .porduct-detail-headimg
    width: 100%;
    img
      width: 100%;
  .porduct-detail-add
    margin-top: 5px;
    padding: 10px 0;
    background: #fff;
    width: 100%;
    height: 4rem;
    position: relative
    .porduct-detail-add-name
      font-size: 18px;
      color: #333333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 10px;
    .porduct-detail-add-price
      font-size: 20px;
      color: #E8552B;
      vertical-align: middle;
      margin: 10px;
      span
        font-size: 16px;
    .porduct-detail-add-button
      width: 120px;
      height: 40px;
      margin-right: 4px;
      padding: 0 14px;
      background: #FF8C57;
      border-radius: 30px;
      line-height: 40px;
      color: #fff;
      text-align: center;
      border-radius: 18px;
      font-size: 16px;
      display: inline-block;
      position: absolute
      bottom: 10px;
      right: 10px;
  .porduct-detail-content
    margin-top: 10px;
    background: #ffffff;
    .porduct-detail-content-title
      background: #ffffff;
      line-height: 40px;
      min-height: 42px;
      font-size: 16px;
      border-bottom: solid 1px #e9e9e9;
      padding-left: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #999;
      .content-icon
        width: 22px;
        height: 16px;
        margin-right: 5px;
        display: inline-block;
        background-image: url(../../assets/img/icon-detail.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100%;
    .porduct-detail-content-body
      color: #858585;
      font-size: 13px;
      white-space: normal;
      line-height: 18px;
      padding: 10px 10px 20px;
      background: #fff;

</style>

