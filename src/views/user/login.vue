<template>
  <div class="login">
    <!-- <input-normal type="number" placeholder="输入您的手机号" maxLength="11" class="login-number"  :value="phone_number"/> -->
    <div class="inputNormal">
      <input
        type="Number"
        placeholder="请输入您的手机号"
        maxlength="11"
        class="input-noraml"
        v-model="phone_number"
      >
      <input
        type="password"
        v-if="showPassword"
        placeholder="请输入您的6位数字密码"
        maxlength="6"
        class="input-noraml"
        v-model="password"
      >
    </div>

    <input-click class="login-button" @click="login">登录</input-click>
  </div>
</template>
<script>
// @ is an alias to /src

import inputNormal from "../../public_comp/inputNoraml";
import inputClick from "../../public_comp/inputClick";
export default {
  name: "login",
  components: {
    inputNormal,
    inputClick
  },
  data() {
    return {
      phone_number: '15921104974',
      password: '111111',
      showPassword: false
    };
  },
  watch: {
    phone_number(val) {
      if (val.length >= 11) {
        this.showPassword = true;
      } else {
        this.showPassword = false;
      }
    }
  },
  mounted() {},
  methods: {
    login() {
      let _this = this;
      _this.Indicator.open({
        text: "加载中...",
        spinnerType: "triple-bounce"
      });
      if (this.phone_number.length === 11 && this.password.length === 6) {
        let loginInfo = {
          phone: this.phone_number,
          password: this.password
        };
        this.Service.IMemberService.MemberLogin(loginInfo).then(e => {
          if (e) {
            console.log("e", e);
            let token = e.token;
            let memberId = e.memberId;

            _this.Service.IStoreService.GetBrandStoreinfoByApi();
            _this.Cache.AddCache({
              key: "H5_MemberInfo",
              data: e,
              timeSpan: 0
            });
            localStorage.setItem("Itoken", token);
            localStorage.setItem("ImemberId", memberId);
            _this.Indicator.close();
            console.log(this.$store.state);
            this.$router.push({
              path: "/user"
            });
          }
        });
      } else {
        this.toast("请输入正确的账号密码。");
      }
    }
  }
};
</script>
<style lang="sass" scoped>
.login 
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin-top: -1px;
  padding-top: 1px;
  margin-bottom: -1px;
  width: auto;
  height: auto;
  background: url("../../assets/img/sh/theme/@2x/member-center/register-bg.png")
  .inputNormal
    width: 90%;
    margin: 1rem;
    margin-top: 5rem;
    .input-noraml
      // width: 100%;
      // height: 2.5rem;
      // line-height: 2.5rem;
      // border-bottom: 1px solid #E9E9E9;
      // padding-left: 0.75rem;
      // font-size: 24px;
      // color: #4a4a4a;
      width: 100%;
      height: 2.5rem;
      line-height: 2.5rem;
      border-bottom: 1px solid #E9E9E9;
      font-size: 20px;
      box-sizing: border-box;
      padding-left: 0.75rem;
      color: #4a4a4a;
      font-weight: normal;
      outline-offset: 0;
      outline-style: none;
      outline-width: 0;
      -webkit-font-smoothing: inherit;
      background-image: none;
  .login-button
    margin-top: 5rem;
</style>

