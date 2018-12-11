<template>
  <div class="shopcart" :class="{'shopcart-fixed': position == 'fixed'} ">
    <div class="shopcart-button" @click="gotoPreOrder">{{button_value}}</div>
    <div class="shopcart-cart">
      <img src="../../assets/img/shopping.png" @click="isShowDetail = !isShowDetail">
      <em class="shopcart-badge" v-show="shopCart.products.filter(e => !e.isExtra).length">{{ shopCart.products.filter(e => !e.isExtra).length}}</em>
    </div>
    <div class="shopcart-detail" @click.prevent.self="isShowDetail = false" v-if="isShowDetail">
      <div class="shopcart-detail-wrap">
        <div class="detail-header">
          <div class="header-text">购物车</div>
          <span class="header-delete" @click="clearShopcart">清空</span>
        </div>
        <div class="detail-body">
          <div class="detail-product" v-for="item in shopCart.products" :key="item.id" v-if="!item.isExtra">
            <div class="p-name">{{item.name}}</div>
            <div class="p-price">{{item.price}}</div>
            <div class="p-cal">
              <div class="minus" @click="minusProduct(item)">
                <img src="../../assets/img/sh/theme/@2x/normal/minus.png">
              </div>
              <div class="p-cal-num">{{item.count}}</div>
              <div class="add" @click="addProduct(item)">
                <img src="../../assets/img/sh/theme/@2x/normal/add.png">
              </div>
            </div>
            <div class="p-components" v-if="item">
              <!-- <div class="comp" v-for="">

              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "shopcart",
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 初始化购物车
      let cloud = this.$store.state.Cloud.Cloud;
      cloud.person = 1;
      this.Service.IShoppingCartService.InitShoppingCart(cloud);
      console.log("初始化购物车成功!");
      let shopCart = this.Service.IShoppingCartService.GetShoppingCartInfo();
      if (!shopCart.products) {
        shopCart.products = [];
      }
      this.shopCart = Object.assign({}, this.shopCart, shopCart);
    },
    gotoPreOrder() {
      this.$router.push({
        path: '/order/preorder'
      })
    },
    // 添加按钮 添加商品
    addProduct(product) {
      let add_product = Object.assign({}, product);
      add_product.count = 1;
      this.Service.IShoppingCartService.AddProduct(add_product);
   
    },

    minusProduct(product) {
      let minus_product = Object.assign({}, product);
      minus_product.count = 1;
      this.Service.IShoppingCartService.DelProduct(minus_product);
    },
    clearShopcart() {
      let cloud = this.$store.state.Cloud.Cloud;
      this.MessageBox.confirm("是否要删除购物车?").then(action => {
        this.init();
        this.isShowDetail = false;
      });
    }
  },
  data() {
    return {
      button_value: "去下单",
      shopCart: {
        products: []
      },
      isShowDetail: false
    };
  },
  computed: {},
  props: {
    position: String
  }
};
</script>
<style lang="sass" scoped>

.shopcart
  position: absolute
  left: 0
  bottom: 0
  background: #FFF
  width: 100%
  height: 60px
  background-color: #333333
  .shopcart-button
    background-image: linear-gradient(-90deg,#F95B2F 0,#EA3B0A 100%);
    width: 108px;
    height: 60px;
    line-height: 60px;
    font-family: PingFang-SC-Medium;
    font-size: 16px;
    color: #FFF;
    letter-spacing: 0;
    text-align: center;
    position: absolute;
    bottom: 0;
    right: 0;
  .shopcart-cart
    img
      display: inline-block;
      width: 3rem;
      height: 3rem;
      margin-top: -.65rem;
      -webkit-user-drag: none;
      position: relative
      left: 30px;
      z-index: 100;
    .shopcart-badge
      position: absolute;
      left: 3.75rem;
      top: -.7rem;
      min-width: 22px;
      min-height: 22px;
      padding: 2px;
      font-size: 16px;
      color: #FFF;
      text-align: center;
      line-height: 18px;
      border-radius: 50%;
      background-color: #000;
      z-index: 120;
  .shopcart-detail
    z-index: 300;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
    background: rgba(1, 1, 1, 0.5);
    .shopcart-detail-wrap
      position: absolute;
      width: 100%;
      height: 600px;
      background: #fff;
      bottom: 0;
      left: 0;
      .detail-header
        border-bottom: 1px solid #eee;
        width: 100%;
        height: 40px;
        .header-text
          float: left;
          font-size: 16px;
          margin-left: 20px;
          line-height: 40px;
        .header-delete
          float: right;
          font-size: 14px;
          line-height: 40px;
          margin-right: 20px;
      .detail-body
        .detail-product
          display: flex;
          display: -webkit-flex;
          justify-content: space-around;
          margin-bottom: 0px;
          margin: 0.5rem;
          color: #333;
          font-weight: normal;
          .p-name
            overflow: hidden;
            display: inline-block;
            -webkit-flex: 1;
            flex: 1;
            height: 24px;
            vertical-align: middle;
            margin-bottom: 0px;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 24px;
            font-weight: normal;
            font-size: 14px;
          .p-price
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 84px;
            flex: 0 0 84px;
            text-align: left;
            font-size: 14px;
          .p-cal
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 84px;
            flex: 0 0 84px;
            max-width: 84px;
            align-items: center;
            -webkit-align-items: center;
            div
              display: inline-block;
              margin-left: 5px;
              font-size: 12px;
            .p-cal-num
                position: relative;
                bottom: 4px;
            .add
              width: 18px;
              height: 18px;
              padding: 5px;
              img
                width: 100%;
                height: 100%;
            .minus
              width: 18px;
              height: 18px;
              padding: 5px;
              img
                width: 100%;
                height: 100%;
.shopcart-fixed
  position: fixed

</style>
