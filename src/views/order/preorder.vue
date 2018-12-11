

<template>
  <div class="preorder">
    <div class="preorder-header">
      <i class="preorder-icon-back"></i>
      <h2>确认订单</h2>
    </div>
    <div class="preorder-body">
      <div class="order-content">
        <div class="multiuser-list-container">
          <div class="multiuser-list">
            <span class="multiuser-head">
              <img src="../../assets/img/sh/defaultHeadPic.svg">
            </span>
            <span class="multiuser-count">{{shopCart.person}}人点餐</span>
          </div>
        </div>

        <div class="product-list-wrap">
          <div class="product-list" v-for="product in shopCart.products" :key="product.id">
            <div class="product-list-box">
              <div class="product-name">
                {{product.name}}
                <span
                  v-if="product.type == 'taocan' || product.type == 'zixuan'"
                >{{product.type == 'taocan' ? '套餐' : '自选'}}</span>
              </div>
              <div class="product-count">{{product.count}}</div>
              <div class="product-price">￥{{product.price}}</div>
            </div>
            <span
              class="product-components"
              v-if="product.components && product.components.length"
              v-for="comp in product.components"
              :key="comp.id"
            >{{comp.name}}</span>
            <span
              class="product-productList"
              v-if="product.products && product.products.length"
              v-for="pro in product.products"
              :key="pro.id"
            >{{pro.name}}X{{pro.count}}</span>
          </div>
        </div>
        <div class="total-price">
          <div>小计： {{allPrice}}</div>
        </div>
      </div>
      <div class="order-other">
        <div class="order-package">
          <span class="package-text">打包费</span>
          <span class="package-price">￥0.00</span>
        </div>
      </div>
      <div class="order-remark">
        <div class="remark-title">
          口味备注
          <i
            class="remark-icon-down"
            @click="showRemark = !showRemark"
            :class="{'up': showRemark}"
          ></i>
        </div>
        <div class="remark-textarea" v-show="showRemark">
          <textarea class="remark-text" placeholder="请输入备注内容（可不填）"></textarea>
        </div>
      </div>
    </div>
    <div class="preorder-footer">
      <span class="preorder-num">共{{shopCart.products.length}}份</span>
      <div class="preorder-button" @click="saveOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
import bigNumber from 'bignumber.js'
export default {
  name: "preorder",
  data() {
    return {
      shopCart: {
        person: 1,
        products: [
          {
            components: []
          }
        ]
      },
      allPrice: 0,
      showRemark: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let shopCart = this.Service.IShoppingCartService.GetShoppingCartInfo();
      let allPrice = 0;
      if (!shopCart) {
        this.$router.push("/menu");
      }
      if (shopCart && !shopCart.products) {
        shopCart.products = [];
      }
      for(let product of shopCart.products) {
        allPrice+=product.price;
      }
      console.log(shopCart);
      this.shopCart = Object.assign({}, this.shopCart, shopCart);
      this.allPrice = new bigNumber(allPrice).toString();
    },
    saveOrder() {
      let orderInfo = this.Service.IShoppingCartService.GetSaveOrderData();
      this.Service.IOrderService.SaveOrder(orderInfo).then(e => {
        console.log(e);
        if (e.message == "") {
          // 存入缓存
          let orderId = e.data.ordersId;
          let no = e.data.no;
          let cloud = this.$store.state.Cloud.Cloud;

          this.$store.state.OrderInfo.orderId = orderId;
          this.$store.state.OrderInfo.no = no;
          this.$store.state.OrderInfo.ShopCartCache = this.shopCart;
          this.Service.IShoppingCartService;
          localStorage.setItem("IorderId", orderId);
          // 清空购物车
          this.Service.IShoppingCartService.InitShoppingCart(cloud);
          // 下单完成后跳转到订单详情
          this.$router.push({
            path: "/order/order_detail"
          });
        } else {
          this.toast(e.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.preorder {
  background-color: #f4f4f4;
  .preorder-header {
    border: none;
    background-image: linear-gradient(
      0deg,
      #f5f5f5,
      #f5f5f5 100%,
      transparent 100%
    );
    background-position: bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-color: #f5f5f5;
    height: 44px;
    h2 {
      width: 100%;
      height: 34px;
      margin: 0;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
    }
  }
  .preorder-body {
    .order-content {
      margin: 0 10px 10px 10px;
      padding: 10px 0;
      background-color: #fff;
      color: #999;
      .multiuser-list-container {
        .multiuser-list {
          overflow: hidden;
          border-bottom: 1px solid #f5f5f5;
          margin: 0 10px;
          padding: 13px 10px 13px 5px;
          .multiuser-head {
            float: left;
            margin-left: -0.25rem;
            color: #999;
            img {
              display: block;
              width: 1rem;
              height: 1rem;
              border: 1px solid #fff;
              border-radius: 50%;
            }
          }
          .multiuser-count {
            float: right;
            font-size: 12px;
            margin-left: -0.25rem;
            line-height: 25px;
          }
        }
      }
      .product-list {
        font-size: 14px;
        .product-list-box {
          display: flex;
          display: -webkit-flex;
          justify-content: space-between;

          .product-name {
            max-width: 60%;
            display: block;
            flex: 0 0 60%;
            padding: 5px;
          }
          .product-count {
            max-width: 15%;
            display: block;
            flex: 0 0 15%;
            padding: 5px;
          }
          .product-price {
            max-width: 25%;
            display: block;
            flex: 0 0 25%;
            padding: 5px;
          }
        }
        .product-components {
          padding: 5px;
        }
        .product-productList {
          padding: 5px;
          display: block;
        }
      }
      .total-price {
        border-top: 1px solid #f5f5f5;
        margin-left: 20px;
        padding: 10px 20px 10px 0;
        text-align: right;
        line-height: 25px;
        font-size: 14px;
        color: #999;
        div {
          font-size: 16px;
          font-weight: bold;
          color: #000;
          letter-spacing: -1px;
        }
      }
    }
    .order-other {
      background-color: #fff;
      margin: 10px;
      padding: 10px 0;
      .order-package {
        color: #666;
        font-size: 16px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        .package-text {
          margin-left: 1rem;
        }
        .package-price {
          margin-right: 1rem;
        }
      }
    }
    .order-remark {
      margin: 10px 10px 10px 10px;
      background-color: #fff;
      .remark-title {
        position: relative;
        padding: 10px;
        color: #999;
        font-size: 14px;
        .remark-icon-down {
          position: absolute;
          right: 10px;
          top: 12px;
          width: 20px;
          height: 14px;
          background-size: 100% 100%;
          background-image: url(../../assets/img/sh/theme/@2x/normal/down.png);
        }
        .remark-icon-up {
          position: absolute;
          right: 10px;
          top: 8px;
          width: 20px;
          height: 14px;
          background-size: 100% 100%;
          background-image: url(../../assets/img/sh/theme/@2x/normal/down.png);
        }
        .up {
          transform: rotate(180deg);
        }
      }
      .remark-textarea {
        position: relative;
        .remark-text {
          width: 90%;
          margin: 0 5%;

          height: 70px;
          background: #f5f5f5;
          border-radius: 2px;
          resize: none;
          padding: 10px;
          border: 0;
          font-size: 14px;
          box-sizing: border-box;
          border: 1px solid #fff;
        }
      }
    }
  }
  .preorder-footer {
    width: 100%;
    height: 60px;
    background-color: #333;
    position: fixed;
    bottom: 0;
    left: 0;
    .preorder-num {
      color: #fff;
      font-size: 14px;
      position: absolute;
      top: 20px;
      left: 10px;
    }
    .preorder-button {
      width: 8rem;
      background: linear-gradient(90deg, #ff8c57 0%, #e84e30 100%);
      font-weight: 700;
      line-height: 60px;
      height: 60px;
      text-align: center;
      border: 0;
      color: #fff;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
