<template>
  <div class="pay" @click.stop="$store.state.Kind.pay_isShow = false">
    <div class="pay-wrap">
      <div class="pay-header">
        <div @click.stop="$store.state.Kind.pay_isShow = false">X</div>
      </div>
      <div class="pay-body">
        <div class="pay-item" v-if="hasBalance">
          <div class="pay-item-header">
            会员余额支付
            <span>￥{{memberPay.toFixed(2,true)}}</span>
          </div>
          <div class="pay-item-body">
            <img src="../../assets/img/icon_pay_ye.png" class="pay-item-img">
            <div class="pay-item-info">
              <h3>账户余额￥{{memberInfo.balance}}</h3>
            </div>
            <div class="pay-item-checkbox" @click.stop="choosePayByuser">
              <i class="pay-item-check-icon"  :class="{'pay-item-check-icon-uncheck': balanceCheck}"></i>
            </div>
          </div>
        </div>

        <div class="pay-item" v-if=" needUserPay > 0 || !memberInfo.memberId">
          <div class="pay-item-header">
            还需支付
            <span>￥{{needUserPay}}</span>
          </div>
          <!-- 微信支付 -->
          <div class="pay-item-body" v-if="browerType == 1 && haveWxPay">
            <img src="../../assets/img/icon_pay_wx.png" class="pay-item-img">
            <div class="pay-item-info">
              <h3>微信支付</h3>
            </div>
            <div class="pay-item-checkbox">
              <i class="pay-item-check-icon"></i>
            </div>
          </div>
          <!-- 支付宝 -->
          <div class="pay-item-body" v-if="browerType !=1">
            <img src="../../assets/img/icon_pay_alipay.png" class="pay-item-img">
            <div class="pay-item-info">
              <h3>支付宝</h3>
            </div>
            <div class="pay-item-checkbox">
              <i class="pay-item-check-icon"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="pay-footer" @click="payForOrder">好的</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pay",
  components: {},
  data() {
    return {
      memberInfo: {},
      memberPay: 0,
      hasBalance: false,
      needUserPay: "0", //需要用其他付的
      payTypeMap: {},
      zongjia: 0,
      payType: "",
      browerType: "",
      haveWxPay: 0,

      //   交互
      balanceCheck: false
    };
  },
  methods: {
    init() {
      let _this = this;
      Promise.all([
        this.Service.IBrandService.GetBrandStores(), //店铺信息
        this.Service.IMemberService.GetMemberInfoByToken() //个人信息
      ]).then(res => {
        console.log(res);
        // 页面交互设置 不用管
        let storeId = localStorage.getItem("IstoreId");
        let storeInfo = res[0].result.data.filter(
          store => store.id == storeId
        )[0];
        let memberInfo = res[1];
        let browerType = this.getBrowerType();
        let haveWxPay = storeInfo.haveWxPay;
        let payType = browerType === 1 ? "wxWeb" : "alipayWeb"; // browerType: 1: 微信 2: h5

        // 参数 传进来的值 下单的值 如果是其他支付替换就行
        console.log(
          this.orderDetail.paidFee,
          this.discount.discount.totalDiscount,
          this.orderDetail.paidFee - this.discount.discount.totalDiscount
        );
        let payData = {
          zongjia: parseFloat(
            this.orderDetail.paidFee - this.discount.discount.totalDiscount
          ),
          nono: this.orderDetail.nono,
          ordersId: this.orderDetail.ordersId
        };

        // 载入
        let orderType = payData.orderType || "order";
        let zongjia = payData.zongjia;
        let nono = payData.nono;
        let cb = payData.cb;
        let ordersId = payData.ordersId;
        // 绑定到页面上的data
        _this.haveWxPay = haveWxPay; //是否有微信pay
        _this.browerType = browerType; //1: 微信 2: h5
        _this.payType = payType; //支付方式
        _this.zongjia = zongjia;
        _this.payTypeMap = { balance: 0 }; //支付组合
        _this.memberInfo = memberInfo; //个人信息
        _this.zongjia = zongjia; //支付的总价
        _this.hasBalance =
          memberInfo && memberInfo.memberId > 0 && orderType === "order"; //是否有余额 必须是在下单用

        // 计算一波
        this.calPrice(true);
      });
    },
    calPrice(needbl) {
      let yue = 0;
      let memberInfo = this.memberInfo;
      if (memberInfo.memberId > 0) {
        yue = parseFloat(memberInfo.balance);
      }
      // 使用余额
      if (needbl && this.hasBalance) {
        this.memberPay = yue > this.zongjia ? this.zongjia : yue;
        this.needUserPay = (this.zongjia - this.memberPay).toFixed(2, true);
      } else {
        // 没有余额就全部使用其他支付
        this.memberPay = 0;
        this.needUserPay = this.zongjia.toFixed(2, true);
      }
      this.payTypeMap.balance = this.memberPay.toFixed(2, true);
      // 如果要付的余额为0 并且总价是大于0的 删除balance
      if (this.payTypeMap.balance == 0 && this.zongjia > 0) {
        delete this.payTypeMap.balance;
      }
      //   如果需要支付其他的 就把支付方法怼进去
      if (this.needUserPay > 0) {
        this.payTypeMap[this.payType] = this.needUserPay;
      } else {
        delete this.payTypeMap[this.payType];
      }
    },
    getBrowerType() {
      const ua = window.navigator.userAgent.toLowerCase();
      console.log(ua);
      return ~ua.indexOf("micromessenger")
        ? 1
        : ~ua.indexOf("alipayclient")
        ? 2
        : 0;
    },
    payForOrder() {
      let paidFee = this.orderDetail.paidFee;
      let data = this.discount.GetPayData();
      console.log(data, paidFee);

      this.Indicator.open({
        text: "加载中...",
        spinnerType: "triple-bounce"
      });

      data.payType = this.payTypeMap;
      this.Service.IOrderService.PayForOrder(data).then(e => {
          console.log(e);
        if (!e.message) {
          this.toast("支付成功");
        } else {
          this.toast(e.message);
        }
        this.Indicator.close();
      });
    },
    choosePayByuser() {
      this.calPrice(this.balanceCheck);
      this.balanceCheck = !this.balanceCheck;
    }
  },
  mounted() {
    this.init();
  },
  props: {
    discount: Object,
    orderDetail: Object
  }
};
</script>
<style lang="scss">
.pay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 1, 1, 0.5);
  z-index: 10;
  font-size: 16px;
  .pay-wrap {
    width: 100%;
    background: white;
    height: 70%;
    position: absolute;
    top: 30%;
    .pay-header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      color: #999;
    }
    .pay-body {
      .pay-item {
        margin: 0 0 0 10px;
        padding-bottom: 18px;
        padding-top: 8px;
        background-color: #fff;
        color: #444;
        .pay-item-header {
          height: 30px;
          min-height: 30px;
          font-size: 16px;
          font-weight: normal;
          padding: 16px 20px 16px 0;
          span {
            font-size: 18px;
            color: #333;
            float: right;
            vertical-align: baseline;
          }
        }
        .pay-item-body {
          display: flex;
          display: -webkit-flex;
          min-height: 4rem;
          border-bottom: rgba(245, 245, 245, 1);
          .pay-item-img {
            flex: 0 0 2.5rem;
            margin-top: 0.65rem;
            height: 2.5rem;
          }
          .pay-item-info {
            display: -webkit-flex;
            display: flex;
            flex: 1;
            -webkit-flex: 1;
            flex-direction: column;
            justify-content: center;
            height: 4rem;
            padding-left: 20px;
            color: #4a4a4a;
            h3 {
              font-size: 14px;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            h4 {
              font-size: 12px;
            }
          }
          .pay-item-checkbox {
            flex: 0 0 2.5rem;
            .pay-item-check-icon {
              background: url(../../assets/img/i-check.png) no-repeat 0 0;
              background-size: contain;
              width: 24px;
              height: 24px;
              display: block;
              position: relative;
              top: 25px;
              border: 1px solid #ccc;
              border-radius: 50%;
            }
            .pay-item-check-icon-uncheck {
                background: none;
            }
          }
        }
      }
    }
    .pay-footer {
      width: 100%;
      height: 48px;
      text-align: center;
      line-height: 48px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: linear-gradient(90deg, #ff8c57 0%, #e84e30 100%);
      color: #fff;
    }
  }
}
</style>

