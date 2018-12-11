<template>
  <div class="couponList">
    <mt-navbar v-model="selected">
      <mt-tab-item :id="1"><span class="couponList-navbar-text">立即使用</span></mt-tab-item>
      <mt-tab-item :id="2"><span class="couponList-navbar-text">已使用</span></mt-tab-item>
      <mt-tab-item :id="3"><span class="couponList-navbar-text">已过期</span></mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item :id="1">
        <div v-if="useList.length" >
          <Item v-for="(item,index) in useList" :key="item.index" :data="item" :product="product"></Item>
        </div>
        <div class="coupon-blank" v-else>暂无优惠券</div>
      </mt-tab-container-item>
      <mt-tab-container-item :id="2">
        <div v-if="usedList.length">
          <Item v-for="(item,index) in usedList" :key="item.index" :data="item" :product="product"></Item>
        </div>
        <div class="coupon-blank" v-else>暂无优惠券</div>
      </mt-tab-container-item>
      <mt-tab-container-item :id="3">
        <div v-if="overdueList.length" >
          <Item v-for="(item,index) in overdueList" :key="item.index" :data="item" :product="product"></Item>
        </div>
        <div class="coupon-blank" v-else>暂无优惠券</div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
    // @ is an alias to /src
    import Item from './Item'

    export default {
        name: "couponList",
        components: {
            Item
        },
        data() {
            return {
                selected: 1,
                couponList: [],
                product: [],
                useList: [],
                usedList: [],
                overdueList: [],
                isOpenMask: false,
                storeId: "100224"
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init:function () {
                Promise.all([
                    this.Service.IProductService.GetStoreProducts({ dataType: 0 }),
                    this.Service.IMemberService.GetMemberCoupons(),
                ]).then(res=>{
                    let product = res[0];
                    let coupons = res[1];
                    console.log("sss",coupons);
                    console.log("product",product);
                    if(product){
                        this.product = product;
                    }
                    if(coupons){
                        this.couponList = coupons;
                        this.checkCoupon(coupons);
                    }
                });
            },
            checkCoupon:function (arr){
                // status  1：已使用  2：已过期  0:可用  3使用时间未到
                let useList = [];
                let usedList = [];
                let overdueList = [];
                let now = new Date().getTime();
                for(let item of arr){
                    // 试用时间未到
                    if (now < item.startTime) { //未到
                        item.status = 3;
                    }
                    switch (item.status) {
                        case 0:
                            useList.push(item);
                            break;
                        case 1:
                            usedList.push(item);
                            break;
                        case 2:
                            overdueList.push(item);
                            break;
                        case 3:
                            useList.push(item);
                            break;
                    }
                }
                this.useList = useList;
                this.usedList = usedList;
                this.overdueList = overdueList;
            },
            // 转赠优惠券函数
            getIncreaeCoupone(coupon) {

            }
            /*      // 初始化
                  init2() {
                      this.getCouponList().then(e => {
                          if (e.data.result.status != 0) {
                              this.toast("请求失败。");
                              return;
                          }
                          console.log(e.data.result.data);
                          let validCoupons = [],
                              invalidCoupons = [];
                          for (let coupon of e.data.result.data) {
                              let is = this.checkCoupon(coupon);
                              if(is) {
                                  invalidCoupons.push(coupon);
                              }
                              else {
                                  validCoupons.push(coupon)
                              }
                          }
                      });
                  },
                  // 获取券数量
                  getCouponList() {
                      return this.axios.post(
                          "http://cloudstoreapi.eshinetest.cn:10100/sapi/IMembers/couponList",
                          {
                              p: {
                                  token: this.token
                              }
                          }
                      );
                  },
                  // check 函数
                  checkCoupon2(coupon) {
                      // status  1：已使用  2：已过期
                      if (coupon.status == 1) return "已使用";
                      if (coupon.status == 2) return "已过期";

                      let now = new Date().getTime();
                      let storeId = this.storeId;

                      // 试用时间未到 过期
                      if (now < coupon.startTime) return "使用时间未到";
                      if (now > coupon.endTime) return "已经过期了";
                      if (storeId == -1) return false;

                      // 本店是否可以使用这张券
                      let storeArray = coupon.stores;
                      let hasInStore = storeArray.filter(
                          store => store.storeId == -1 || store.storeId == storeId
                      );
                      if (!hasInStore.length) return "本店不能使用这张券";

                      if(coupon.voucherType == 0 && coupon.products) {
                          let product = coupon.products.forEach(product => {
                              // 获取产品 看看是否本店售卖此产品
                          })

                          if(!product) {
                              return true;
                          }
                      }
                      return 0;
                  },
      */
        }
    };
</script>
<style lang="scss" scoped>
  .mint-navbar {
    position: fixed;
    z-index: 9;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid #DAD8D8;
  }
  a,a:visited,a:link,a:active,a:hover{
    text-decoration:none;
  }
  .couponList-navbar-text{
    font-size: 14px;
    color: #3a3a3a;
    opacity: 0.7;
    height: 50px;
    box-sizing: border-box;
    line-height: 50px;
  }
  .mint-tab-item.is-selected .couponList-navbar-text{
    color: #F04641;
    /*opacity: 1;*/
  }
  .mint-tab-container{
    margin-top: 50px;
    min-height: 300px;
  }
  .mint-navbar .mint-tab-item.is-selected{
    border-bottom: 3px solid #F04641;
    color: #F04641;
  }
  .mint-navbar .mint-tab-item{
    padding: 0;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .coupon-blank {
    width: 7.4rem;
    margin: 30px auto;
    padding-top: 8.5rem;
    background: url(../../../assets/img/coupon-blank.png) no-repeat 0 0;
    background-size: 100% auto;
    font-size: 16px;
    text-align: center;
    color: #666;
  }
</style>

