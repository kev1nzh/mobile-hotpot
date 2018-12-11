

<template>
  <div class="order-detail">
    <div class="order-detail-wrapper">
      <div class="order-head">
        <div class="head-desk">
          <div class="desk-name">存在1</div>
          <div>桌</div>
        </div>
        <div class="desk-info">
          <div class="desk-info-item">
            <span class="item-name">订单号</span>
            <span class="item-value">{{showData.no}}</span>
          </div>
          <div class="desk-info-item">
            <span class="item-name">就餐人数</span>
            <span class="item-value">{{showData.person}}</span>
          </div>
          <div class="desk-info-item">
            <span class="item-name">下单时间</span>
            <span class="item-value">{{showData.startTime}}</span>
          </div>
        </div>
      </div>
      <div class="order-body">
        <div class="order-detail" :class="{'order-detail-all': showDetail}">
          <div class="detail-title">已点餐品</div>
          <div class="detail-gotomenu" @click="backToMenu">
            <span>继续点餐</span>
          </div>
          <div class="detail-list-wrap">
            <div class="order-list" v-for="product in showData.products" :key="product.categoryId">
              <div class="order-list-title-wrap">
                <div class="order-list-title">{{product.categoryName}}</div>
                <div class="order-list-num">{{product.productNum}}</div>
                <div class="order-list-item"></div>
              </div>
              <div class="order-list-product">
                <div class="product-son-wrap" v-for="item in product.products" :key="item.id">
                  <div class="product-sontitle">
                    <div class="order-list-name">{{item.productName}}</div>
                    <div class="order-list-num">{{item.cnt}}</div>
                    <div class="order-list-price">{{item.unitPrice}}</div>
                  </div>
                  <!-- components -->
                  <div class="order-list-componetns-wrap">
                    <span
                      class="order-list-componetns"
                      v-for="comp in item.components"
                      :key="comp.id"
                    >{{comp.name}}、</span>
                  </div>
                  <!-- 子商品 -->
                  <div
                    class="product-sonproduct"
                    v-for="sonproduct in item.products"
                    :key="sonproduct.id"
                  >
                    <div class="order-list-name">
                      <div class="order-list-name-wrap">
                        <div class="order-list-tip" v-if="sonproduct.tips">
                          <span>{{sonproduct.tips}}</span>
                        </div>
                        <div class="order-list-name-text">{{sonproduct.productName}}</div>
                      </div>
                    </div>
                    <div class="order-list-num">{{sonproduct.cnt}}</div>
                    <div class="order-list-price">{{sonproduct.unitPrice}}</div>
                  </div>
                  <!-- scaleName -->
                  <div class="product-scaleName" v-if="item.scaleName">{{item.scaleName}}</div>

                  <div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-showmore" @click="showDetail = !showDetail" v-if="!showDetail">
            <div>共{{showData.products.length}}个餐品</div>
            <i class="detail-icon-down-arrow"></i>
          </div>
        </div>
        <div class="detail-personfee">
          <div v-for="product in showData.personProduct" :key="product.id" class="detail-product">
            <div class="product-name">{{product.productName}}</div>
            <div class="product-count">{{product.cnt}}</div>
            <div class="product-price">{{product.paidFee}}</div>
          </div>
        </div>
        <div class="detail-rechange">
          <div class="detail-rechange-wrap">
            <div class="detail-rechange-item">
              <div class="sec-title">充值买单更优惠</div>
              <div class="sec-text">最高10元专属奖励</div>
            </div>
            <div class="detail-rechange-item-rt">
              <div class="sec-button">去充值</div>
            </div>
          </div>
        </div>
        <div class="detail-youhui">
          <div class="youhui-coupons">
            <div class="coupons-name">优惠券</div>
            <div class="coupons-value" @click="showCoupons = true">
              <span v-if="discount.memberCoupons.length">有{{discount.memberCoupons.length}}张优惠券可用></span>
              <span v-else>无可用优惠券</span>
            </div>
          </div>
          <div class="youhui-intergral" v-if="discount.integralRule.enable">
            <div class="inter-lt">
              <div class="opt-name">会员积分</div>
              <div class="opt-tap">
                <span class="opt-tap-tip">积分可抵{{discount.integralRule.limitPrice}}</span>
              </div>
              <div class="opt-tips">
                当前可用
                <span>{{discount.memberInfo.integral}}</span>积分，
                可用
                <span>{{discount.integralRule.maxUseIntegral}}</span>积分抵用
                <span>{{discount.integralRule.maxExChangeMoney}}</span>元
              </div>
            </div>
            <div class="inter-rt" @click="useOrUnUseIntegral">
              <div class="opt-chk">
                <i
                  class="order-icon-check"
                  :class="{'order-icon-uncheck': !discount.discount.item.integral.isUsed}"
                ></i>
              </div>
              <div class="opt-value">-{{discount.integralRule.maxExChangeMoney}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="coupon-list" v-show="showCoupons">
      <div class="coupon-list-wrap">
        <div
          class="coupon"
          v-for="(item,index) in discount.memberCoupons"
          :key="item.id"
          @click="checkCoupon(item, index)"
        >
          <Item :data="item" :product="product"/>
          <i class="coupon-list-check" v-show="useCoupon.includes(item)"></i>
        </div>
        <div class="coupon-button">确认使用</div>
      </div>
    </div>
    <div class="order-detail-footer">
      <div class="order-total-price">
        <span class="total-price">
          需付：
          <span class="price">{{(orderDetail.paidFee - discount.discount.totalDiscount).toFixed(2, true)}}</span>
        </span>
        <del class="total-cut">
          优惠
          <span class="price">{{discount.discount.totalDiscount}}</span>
        </del>
      </div>
      <div class="button-box" @click="$store.state.Kind.pay_isShow = true">
        <div>我要买单</div>
      </div>
    </div>
    <pay v-if="$store.state.Kind.pay_isShow" :discount="discount" :orderDetail="orderDetail"/>
  </div>
</template>

<script>
import Item from "../user/couponList/Item";
import pay from "./pay";

export default {
  data() {
    return {
      discount: {
        orderInfo: {
          no: ""
        }
      },
      showData: {
        no: "",
        person: "",
        startTime: "",
        categoryObj: {},
        personProduct: []
      },
      orderDetail: {},
      product: [],
      useCoupon: [],
      showDetail: false,
      showCoupons: false,
      useIntegral: false
    };
  },
  components: {
    Item,
    pay
  },
  methods: {
    init() {
      // 获取优惠镀锡
      let orderId = this.getOrderId();
      this.getDiscount(orderId).then(e => {
        console.log("ok");
      });
    },
    getOrderId() {
      if (localStorage.getItem("IorderId")) {
        return localStorage.getItem("IorderId");
      } else {
        return this.$store.state.OrderInfo.orderId;
      }
    },
    async getDiscount(orderId) {
      this.Indicator.open({
        text: "加载中...",
        spinnerType: "triple-bounce"
      });
      let orderDetail = await this.Service.IOrderService.GetOrderDetail(
        orderId
      );
      let discount = await this.Service.IDiscountService.GetDiscountInstance(
        orderDetail
      );
      let types = await this.Service.IProductTypeService.GetBrandProductTypes();
      let product = await this.Service.IProductService.GetStoreProducts({
        dataType: 0
      });

      // 加入store
      this.$store.commit("saveOrderInfo", discount.orderInfo);
      this.$store.commit("saveOrderDiscount", discount);
      let prop = Object.getPrototypeOf(discount);
      this.discount = Object.assign(
        Object.create(prop),
        this.discount,
        discount
      );
      // 插入展示数据
      let orderInfo = discount.orderInfo;
      this.showData.no = orderInfo.nono;
      this.showData.person = orderInfo.person;
      this.showData.startTime = this.moment(orderInfo.startTime)
        .format()
        .substring(11, 19);
      this.Indicator.close();

      // 构建产品list结构
      let categoryArr = [];
      let personProduct = discount.orderInfo.products.filter(p => p.isExtra);

      let category = types.forEach(type => {
        let pros = discount.orderInfo.products.filter(
          p => p.categoryId == type.id && !p.isExtra
        );
        if (pros && pros.length > 0) {
          categoryArr.push({
            categoryId: type.id,
            categoryName: type.name,
            products: pros
          });
        }
      });
      if (categoryArr.length < 2) {
        this.showDetail = true;
      }
      this.product = product;
      this.showData.products = categoryArr;
      this.showData.personProduct = personProduct;
      this.orderDetail = orderDetail;
    },
    useOrUnUseIntegral() {
      this.discount.UseOrUnUseIntegral();
      console.log(this.discount);
      this.useIntegral = !this.useIntegral;
      // this.$forceUpdate();
    },
    checkCoupon(coupon, index) {
      let oldIsUsed = coupon.isUsed;
      let checkCoupon = this.discount.UseOrUnUseCoupon(coupon);
      console.log(checkCoupon);
      if (!coupon.isUsed && !oldIsUsed) {
        if (checkCoupon.message) {
          this.toast(checkCoupon.message);
        } else {
          this.toast("该券不满足规则，请选择其他券。");
        }
      } else {
        let isHave = this.useCoupon.includes(coupon);
        if (isHave) {
          let i = this.useCoupon.indexOf(coupon);
          this.useCoupon.splice(i, i + 1);
        } else {
          this.useCoupon.push(coupon);
        }
      }
    },
    backToMenu() {
      this.$router.push({
        path: '/menu'
      })
    }
  },
  created() {
    // ********************************
    this.init();

    // ********************************
  }
};
</script>


<style lang="scss" scoped>
.order-detail {
  margin: 0px;
  height: 100%;
  background: #e4e4e4;
  
  .order-detail-wrapper {
    .order-head {
      position: relative;
      height: 125px;
      border: 1px solid #333;
      background: #252525 url(../../assets/img/sh/theme/@2x/normal/bg_black.png)
        no-repeat 0 0;
      background-size: 100% auto;
      z-index: 2;
      .head-desk {
        width: 108px;
        height: 60px;
        background: url(../../assets/img/sh/desk.png) no-repeat 0 0;
        background-size: contain;
        margin: 10px auto;
        padding: 7px 0 0 8px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        .desk-name {
          height: 24px;
          font-size: 24px;
        }
      }
      .desk-info {
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
        .desk-info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          font-size: 12px;
          span {
            color: #999;
          }
        }
      }
    }
    .order-body {
      min-height: auto;
      max-height: none;
      // margin: 10px;
      background: #e4e4e4;
      overflow: hidden;
      position: relative;
      margin-bottom: 50px;
      .order-detail {
        overflow: hidden;
        position: relative;
        min-height: 150px;
        max-height: 350px;
        padding-bottom: 10px;
        margin: 10px;
        background: #fff;
        box-shadow: 4px 4px 4px 0 #e4e4e4;
        border-radius: 4px;
        .detail-title {
          padding-top: 7px;
          text-align: center;
          font-size: 20px;
          color: #333333;
        }
        .detail-gotomenu {
          display: block;
          text-align: center;
          span {
            display: inline-block;
            background: rgba(252, 208, 188, 0.3);
            border-radius: 2px;
            margin: 5px 0 10px;
            padding: 2px 5px;
            font-size: 14px;
            color: #fb8a56;
          }
          span:after {
            content: ">";
            display: inline-block;
            transform: scaleY(1.5);
            transform-origin: 50% 50%;
            margin-left: 2px;
            vertical-align: 1px;
          }
        }
        .detail-list-wrap {
          .order-list {
            .order-list-title-wrap {
              display: flex;
              display: -webkit-flex;
              font-size: 16px;
              border-bottom: 2px solid #f5f5f5;
              .order-list-title {
                flex: 0 0 60%;
                padding: 5px;
              }
              .order-list-num {
                flex: 0 0 15%;
                padding: 5px;
              }
              .order-list-item {
                flex: 0 0 25%;
                padding: 5px;
              }
            }
            .order-list-product {
              .product-son-wrap {
                .product-sontitle {
                  display: flex;
                  display: -webkit-flex;
                  font-size: 14px;
                  .order-list-name {
                    flex: 0 0 60%;
                    padding: 5px;
                  }
                  .order-list-num {
                    flex: 0 0 15%;
                    padding: 5px;
                  }
                  .order-list-price {
                    flex: 0 0 25%;
                    padding: 5px;
                  }
                }
                .order-list-componetns-wrap {
                  .order-list-componetns {
                    font-size: 10px;
                    color: #474747;
                  }
                }
                .product-sonproduct {
                  display: flex;
                  display: -webkit-flex;
                  font-size: 12px;
                  color: #ccc;
                  .order-list-name {
                    flex: 0 0 60%;
                    padding: 5px;
                    .order-list-name-wrap {
                      display: flex;
                      flex: 0 0 160px;
                      align-items: center;
                      font-size: 12px;
                      .order-list-tip {
                        display: inline-block;
                        width: 37px;
                        height: 15px;
                        margin-right: 5px;
                        background: #e8552b;
                        border-radius: 20px;
                        span {
                          display: inline-block;
                          width: 74px;
                          font-size: 20px;
                          transform: scale(0.5);
                          transform-origin: 0 0;
                          line-height: 30px;
                          color: #fff;
                          text-align: center;
                        }
                      }
                      .order-list-name-text {
                        height: 15px;
                        line-height: 15px;
                        color: #474747;
                      }
                    }
                  }
                  .order-list-num {
                    flex: 0 0 15%;
                    padding: 5px;
                  }
                  .order-list-price {
                    flex: 0 0 25%;
                    padding: 5px;
                  }
                }
                .product-scaleName {
                  font-size: 12px;
                  color: #ccc;
                  padding: 0 5px;
                }
              }
            }
          }
        }
        .detail-showmore {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 60px;
          padding-top: 20px;
          background-image: linear-gradient(0, #fff, rgba(255, 255, 255, 0.8));
          text-align: center;
          font-size: 12px;
          line-height: 60px;
        }
      }
      .detail-personfee {
        margin: 10px;
        background: #fff;
        box-shadow: 4px 4px 4px 0 #e4e4e4;
        border-radius: 4px;
        .detail-product {
          display: flex;
          display: -webkit-flex;
          font-size: 12px;
          .product-name {
            flex: 0 0 60%;
            padding: 5px;
          }
          .product-count {
            flex: 0 0 15%;
            padding: 5px;
          }
          .product-price {
            flex: 0 0 25%;
            padding: 5px;
          }
        }
      }
      .detail-rechange {
        position: relative;
        height: 50px;
        background-image: linear-gradient(50deg, #f8f1ce 0%, #ffedb3 100%);
        box-shadow: 0 2px 4px 0 rgba(200, 200, 200, 0.5);
        margin: 10px;
        background: #fff;
        border-radius: 4px;
        .detail-rechange-wrap {
          display: flex;
          justify-content: space-between;
          background: url(../../assets/img/sh/bg-coin.png) no-repeat right 0;
          background-size: contain;
          padding-left: 65px;
          background-image: linear-gradient(50deg, #f8f1ce 0%, #ffedb3 100%);
          .detail-rechange-item {
            display: flex;
            height: 50px;
            flex-direction: column;
            justify-content: center;
            .sec-title {
              font-weight: bold;
              font-size: 16px;
              color: #333333;
            }
            .sec-text {
              font-size: 12px;
              color: #666;
            }
          }
          .detail-rechange-item-rt {
            margin-right: 10px;
            display: flex;
            height: 50px;
            flex-direction: column;
            justify-content: center;
            .sec-button {
              width: 68px;
              height: 28px;
              background: #333333;
              box-shadow: 0 2px 11px 0 rgba(166, 166, 166, 0.5);
              border-radius: 20px;
              text-align: center;
              line-height: 28px;
              color: #fff;
              font-size: 14px;
            }
          }
        }
        .detail-rechange:before {
          box-sizing: border-box;
          content: "";
          position: absolute;
          top: -7px;
          left: -7px;
          width: 45px;
          height: 50px;
          background: url(../../assets/img/sh/i-rec.png) no-repeat 0 0;
          background-size: contain;
        }
        .detail-rechange-wrap:before {
          content: "";
          position: absolute;
          left: 18px;
          top: 5px;
          width: 40px;
          height: 40px;
          background: url(../../assets/img/sh/i-present.png) no-repeat 0 0;
          background-size: contain;
        }
      }
      .order-detail-all {
        max-height: none;
      }
      .order-detail:before {
        content: "";
        position: absolute;
        top: -15px;
        left: 30px;
        width: 80px;
        height: 80px;
        background: url(../../assets/img/sh/cooked.png) no-repeat 0 0;
        background-size: contain;
      }
      .detail-youhui {
        margin: 10px;
        background: #fff;
        box-shadow: 4px 4px 4px 0 #e4e4e4;
        border-radius: 4px;
        font-size: 12px;
        .youhui-coupons {
          line-height: 50px;
          border-bottom: 1px solid #f5f5f5;
          display: flex;
          justify-content: space-between;
          margin: 0 10px;
          .coupons-name {
            font-weight: bold;
            font-size: 16px;
            color: #333333;
          }
          .coupons-value {
            flex: 1;
            text-align: right;
            span {
              color: #e8552b;
            }
          }
        }
        .youhui-intergral {
          display: flex;
          justify-content: space-between;
          margin: 0 10px;
          .inter-lt {
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .opt-name {
              margin-bottom: 2px;
              font-weight: bold;
              font-size: 16px;
              color: #333333;
            }
            .opt-tap {
              width: 100px;
              height: 18px;
              background: rgba(255, 140, 87, 0.2);
              border-radius: 9px;
              position: relative;
              bottom: 20px;
              left: 70px;
              .opt-tap-tip {
                display: block;
                color: black;
                width: 100%;
                height: 100%;
                font-size: 12px;
                text-align: center;
                color: #f95b2f;
                font-family: PingFangSC-Regular;
              }
              .opt-tips {
                color: #999;
                span {
                  color: #fb8a56;
                }
              }
            }
          }
          .inter-rt {
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            text-align: right;
            .opt-chk {
              text-align: right;
              .order-icon-check {
                display: inline-block;
                width: 21px;
                height: 21px;
                border-radius: 50%;
                border: none;
                background: url(../../assets/img/i-check.png) no-repeat 0 0;
                background-size: contain;
              }
              .order-icon-uncheck {
                display: inline-block;
                width: 21px;
                height: 21px;
                border: 1px solid #ccc;
                border-radius: 50%;
                background: none;
              }
            }

            .opt-value {
              color: #e8552b;
            }
          }
        }
      }
    }
  }
  .coupon-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 400;
    .coupon-list-wrap {
      position: relative;
      .coupon {
        position: relative;
        .coupon-list-check {
          content: "";
          position: absolute;
          top: 22px;
          right: 30px;
          width: 24px;
          height: 24px;
          background: url(../../assets/img/i-check.png) no-repeat 0 0;
          background-size: contain;
          z-index: 500;
        }
      }
      .coupon-button {
        position: fixed;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(-90deg, #ff8c57 0%, #e84e30 100%);
        width: 100%;
        height: 48px;
        text-align: center;
        line-height: 48px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        z-index: 500;
      }
    }
  }
  .order-detail-footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    background-color: #333;
    font-size: 14px;
    .order-total-price {
      flex: 1;
      padding-left: 10px;
      line-height: 48px;
      .total-price {
        color: #fff;
        .price {
          font-size: 18px;
          color: #fff;
          position: relative;
          padding-left: 10px;
        }
        .price:before {
          content: "￥";
          position: absolute;
          top: 50%;
          left: 0;
          margin-top: -5px;
          transform-origin: 50% 50%;
          transform: scale(0.9, 1);
          line-height: 1;
          font-size: 12px;
        }
      }
      .total-cut {
        color: #999;
        .price {
          position: relative;
          padding-left: 10px;
        }
        .price:before {
          content: "￥";
          position: absolute;
          top: 50%;
          left: 0;
          margin-top: -5px;
          transform-origin: 50% 50%;
          transform: scale(0.9, 1);
          line-height: 1;
          font-size: 12px;
        }
      }
    }
    .button-box {
      flex: 0 0 140px;
      line-height: 48px;
      background-image: linear-gradient(-90deg, #ff8c57 0%, #e84e30 100%);
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>