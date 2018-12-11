<template>
  <div class="user-box">
    <div class="user-box-head" @click="gotoUser()">
      <img src="../../assets/img/sh/defaultHeadPic.svg">
    </div>
    <div class="user-box-login">
      <p class="login-button" @click="gotoLogin()" v-if="!isLogin">登录/领取</p>
      <p class="login-button card-bar" @click="gotoLogin()" v-else>会员卡(<b>{{brandName}}</b>)</p>
      <p class="login-store">测试数据门店</p>
    </div>
    <div class="user-box-order" @click="goOrder">
      <i class="user-box-notebook"></i>
      订单
    </div>
    <div class="user-box-desk-no"></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "user-box",
  components: {},
  mounted() {
    this.init();
  },
  data() {
    return {
      isLogin: {},
      brandName: '',
    };
  },
  methods: {
    init() {
      this.Service.IBrandService.GetBrandStores()
      .then(e => {
        let userInfo = this.Cache.GetCache({
          key: "H5_MemberInfo"
        });

        this.brandName = e.result.brand.name;
        this.isLogin = this.$store.state.SysMember.data.memberId;
      })
    },
    gotoLogin() {
      this.$router.push({
        path: "/user/login"
      });
    },
    goOrder(){
      this.$router.push({
        path: '/user/order'
      })
    },
    gotoUser() {
      let isLogin = this.$store.state.SysMember;
      console.log(isLogin)
      // let isLogin = true;
      if (isLogin) {
        this.$router.push({
          path: "/user"
        });
      } else {
        let isLogin = this.toast("请先登录！");

        setTimeout(() => {
          isLogin.close();
          this.gotoLogin();
        }, 1000);
      }
    }
  }
};
</script>
<style lang="sass" scoped>
.user-box 
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #252525;
  background-image: url(../../assets/img/sh/theme/@2x/normal/bg_black.png);
  background-size: 100% 100%;
  position: relative;
  height: 5.5rem;
  div
    display: inline-block;
  .user-box-head
    margin: 0.15rem 1.2rem 0 1.8rem;
    width: 3.25rem;
    height: 4.45rem;
    position: relative;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(../../assets/img/sh/theme/@2x/normal/head.png);
    background-size: 100% 100%;
    font-weight: bold;
    line-height: 1.42857;
    img
      position: absolute;
      bottom: 0.1rem;
      left: 0.1rem;
  .user-box-login
    width: 7.25rem;
    height: 4.45rem;
    margin: 0.15rem 1.2rem 0 0rem;
    color: #FFF;
    .login-button
      font-size: 16px;
      margin-bottom: 1rem;
      b
        display: inline-block;
        overflow: hidden;
        max-width: 3.5rem;
        min-width: 1rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: bottom;
        font-size: 14px;
    .login-store
      font-size: 14px;
  .user-box-order
      font-size: 14px;
      font-weight: 400;
      position: absolute;
      top: 2.75rem;
      right: 10px;
      width: 4.3rem;
      height: 1.8rem;
      margin-top: -18px;
      padding-left: 10px;
      border-radius: 18px;
      border-radius: 30px;
      line-height: 1.8rem;
      color: #FFF;
      background-color: rgba(255, 255, 255, 0.15);
      i 
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        margin-left: 5px;
        margin-right: 7px;
        vertical-align: middle;
        background-image: url(../../assets/img/sh/theme/@2x/normal/order.png);
        background-size: 100% 100%;
</style>
