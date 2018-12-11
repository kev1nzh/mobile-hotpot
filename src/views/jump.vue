<template>
  <div class="jump"></div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "jump",
  components: {},
  mounted() {
    this.router();
  },
  methods: {
    router() {
      let router = this.getRouterRouter();
      console.log(router);
      let infos,
        cloud = {};

      cloud.brandId = router.params[0];
      if (!router.params) return;
      // 状态
      cloud.state = router.params[1];
      if (router.params[2]) {
        cloud.storeId = router.params[2];
      }
      if (router.params[3]) {
        cloud.deskId = router.params[3];
      }
      if (router.params[5]) {
        cloud.state === "7"
          ? (cloud.activeId = infos[5])
          : (cloud.ordersIds = infos[5]);
      }
      if (router.params[6]) {
        cloud.mobile = router.params[6];
      }
      if (router.params[7]) {
        clould.increase = router.params[7];
      }

      // 这里要把门店品牌信息载入framework里
      console.log(cloud);
      this.$store.state.Cloud.Cloud = cloud;


      //0,验证支付， 1 => 个人中心 2 => 优惠码 3 => 菜单 4 => 注册 5 => 我的订单 6 => 手机绑定注册支付密码 7 => 扫码领券 8=> 转增优惠券
      let stateName = [
        "testPay",
        "my",
        "youhui",
        "menu",
        "memberRegister",
        "dingdan",
        "memberPassword",
        "scanGetCoupon",
        "increaseCoupon"
      ][cloud.state - 0];
      console.log(stateName);
      // 注册
      if (stateName == "memberRegister") {
      }
      // 扫码送券
      else if (stateName === "scanGetCoupon") {
        this.$router.push({
          name: "menu"
        });
      }
      // 赠券
      else if (stateName === "increaseCoupon") {
      }
      // 都没有就进入menu
      else {
        this.$router.push({
          name: "menu"
        });
      }
    },
    // 获取href的参数
    // return {Object}
    getRouterRouter() {
      let href = window.location.href;
      console.log(href);
      let arg = href.split("?");
      let router = {};

      router.params = href.split("/P/")[1].split(",");
      router.token = arg[1]
        .split("#")[0]
        .split("&")[0]
        .split("=")[1];

      console.log(router);
      return router;
    }
  }
};
</script>
