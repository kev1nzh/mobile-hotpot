<template>
  <div class="user">
    <div class="user-card-wrap">
        <!-- :style="{background:'url(../../assets/img/sh/theme/@2x/normal/vip'+viplevel.curr.level+'.png)'}"-->
      <div class="user-card-container" v-if="viplevel.curr">
        <div class="card-vip">
          <div class="card-vip-pic">
            <img src="../../assets/img/sh/defaultHeadPic.svg">
          </div>
          <div class="card-vip-message">
            <p class="vip-message-level">{{userData.gradeName}}</p>
            <p class="vip-message-id">{{userData.nickName||("用户"+userData.memberId)}}</p>
          </div>
          <div class="card-vip-integral">积分:{{userData.integral}}</div>
          <div class="card-discount" v-if="userData.disCount!=10">{{userData.disCount}}<b>折</b></div>
        </div>
        <div class="card-foot">
          <div class="card-foor-number">
            会员卡号：{{userData.memberId}}
          </div>
          <div class="card-foot-qcode" @click="getSSoToken"> </div>
        </div>
      </div>
      <div class="user-card-grade" @click="goUrl('/user/level')">
        <div class="grade-required"></div>
        <div class="grade-member" v-if='viplevel.curr'>
          <div class="grade-middle-line"></div>
          <div class="grade-line">
            <h5>{{viplevel.curr.name}}</h5>
            <p v-if="viplevel.prve">
              <span>{{viplevel.prve.levelCnt}}&lt;</span>
              成长值
              <span>&lt;{{viplevel.curr.levelCnt}}</span>
            </p>
            <p v-else>注册即会员</p>
          </div>
          <div class="grade-line">
            <h5 v-if='viplevel.next'>{{viplevel.next.name}}</h5>
            <p>
              <span v-if='viplevel.curr'>{{viplevel.curr.levelCnt}}&lt;</span>
              成长值
              <span v-if='viplevel.latter'>&lt;{{viplevel.latter.levelCnt}}</span>
            </p>
          </div>
        </div>
        <div class="grade-upgrade" v-if="viplevel.next&& viplevel.curr && userData.integral">差{{viplevel.next.levelCnt - userData.integral}}分可升到V{{viplevel.next.level}}</div>
      </div>
      <div class="user-card-box">
        <div class="user-card-menu">
          <div class="menu-wrap">
            <div @click="goUrl('/user/couponList')">
              <i class="menu-icon-coupon"></i>
              <b class="menu-wrap-number">{{couponCnt}}</b>
              <div class="menu-wrap-name">券包</div>
            </div>
            <div @click="goUrl('/user/integral')">
              <i class="menu-icon-intergal"></i>
              <b class="menu-wrap-number">{{userData.integral}}</b>
              <div class="menu-wrap-name">积分</div>
            </div>
            <div @click="goUrl('/user/order')">
              <i class="menu-icon-order"></i>
              <b class="menu-wrap-number">{{orderCount}}</b>
              <div class="menu-wrap-name">订单</div>
            </div>
            <div @click="goUrl('/user/balance')">
              <i class="menu-icon-pay"></i>
              <b class="menu-wrap-number">{{userData.balance}}</b>
              <div class="menu-wrap-name">钱包</div>
            </div>
          </div>
        </div>
        <div class="user-card-adv">
          <div class="card-adv-activity">
            <h3>参与活动享优惠</h3>
            <div class="recharge-activity" @click="goUrl('/user/balance')" v-if="acitivity.Rechargecash">
              <div class="item-content">
                最高<strong>{{acitivity.Rechargecash.startAmount}}元</strong>专属奖励
              </div>
              <div class="item-content">
                <i class="menu-icon-crown"></i>
                充值即成为会员
              </div>
              <span class="item-link">去充值</span>
            </div>
            <div class="package-activity" @click="goUrl('/activity/coupon')" v-if="acitivity.Rechargecoupon.list">
              <div class="item-title">
                <strong>{{acitivity.Rechargecoupon.allCount}}张</strong>
                优惠券等你来拿
              </div>
              <div class="item-text">
                <i class="menu-icon-gift"></i>
                超值好礼 触手可及
              </div>
              <div class="package-list">
                <div class="package-li" v-for="(item,index) in acitivity.Rechargecoupon.list" :key="item.id">
                  <div><strong>{{item.totalPrice}}元</strong></div>
                  <div>礼包</div>
                </div>
              </div>
              <span class="item-link">去购买</span>
            </div>
          </div>
        </div>

        <div class="user-card-button">
          <div class="card-button-wrap">
            <div class="nav-button" @click="goUrl('/user/information')">
              <span><i class="user-icon-my"></i></span>
              我的资料
              <i class="user-ion-chevron"></i>
            </div>
              <div class="nav-button" @click="goUrl('/menu')">
              <span><i class="user-icon-order"></i></span>
              去点餐
              <i class="user-ion-chevron"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!--支付码弹出层-->
    <mt-popup
            v-if="paymentCode.code"
            v-model="paymentCode.popup"
            popup-transition="popup-fade"
            :modal="true"
            :closeOnClickModal="true"
    >
      <div class="qrcode-box">
        <div class="code-wrap">
          <div class="barcode-wrap">
            <barcode :value="paymentCode.code" :options="{ displayValue: false,height: 50,}"></barcode>
          </div>
          <div class="numcode-wrap ng-binding">{{paymentCode.code}}</div>
          <div class="qrcode-wrap">
            <qrcode :value="paymentCode.code" :options="{ size:220}"></qrcode>
          </div>
        </div>
        <div class="code-footer">
          到店出示给收银员即可使用
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
    import VueQrcode from '@xkeshi/vue-qrcode';
    import VueBarcode from '@xkeshi/vue-barcode'
    export default {
        name: "user",
        components: {
            barcode:VueBarcode,
            qrcode:VueQrcode
        },
        data() {
            return {
                paymentCode:{
                    popup:false,
                    code: null,
                },
                userData:{

                },
                couponCnt:0,
                acitivity:{
                    Rechargecash:null,
                    Rechargecoupon:{
                        list:[]
                    },
                },
                viplevel:{
                    index:0,
                    prve:null,
                    curr:null,
                    next:null,
                    latter:null
                },
                orderCount:0,
                vipCard: {
                    level: '白金',
                    id: '用户张青',
                    integral: '10',
                    number: '208768'
                }
            }
        },
        mounted() {
            this.init();//用户数据，粉丝等级 订单数据
            this.getAcitivity();//活动列表
        },
        methods: {
            init:function(){
                Promise.all(
                    [
                        this.Service.IMemberService.GetMemberInfoByToken(), //获取用户数据
                        this.Service.IBrandService.GetBrandGrades(),  //获取粉丝等级
                    ]
                ).then(res=>{
                    let userData = res[0];
                    console.log("userData",userData);
                    let grades = res[1].data;
                    let gradeId = userData.gradeId;
                    //过滤等级
                    grades = grades.filter(d=>{
                        return (d.id != 1054 && d.id != 825);
                    });
                    let index = grades.findIndex(d=>{
                        return gradeId==d.id
                    });
                    let prve = grades[index-1];
                    let curr = grades[index];
                    let next = grades[index+1];
                    let latter = grades[index+2];
                    console.log("index",index);
                    // 注入
                    this.userData = userData;
                    this.viplevel = {
                        index:index,
                        prve:prve,
                        curr:curr,
                        next:next,
                        latter:latter
                    };
                    console.log("grades",grades);
                    /*获取订单数量*/
                    return this.Service.IOrderService.GetMemberOrdersCount({memberId:userData.memberId})
                }).then(d=>{
                    this.orderCount = d;
                    return this.Service.IMemberService.GetMemberCoupons()
                }).then(d=>{
                    if(d){
                        let couponCnt = this.getUseCouponCnt(d);
                        this.couponCnt = couponCnt;
                    }
                })
            },
            getUseCouponCnt:function (arr){
                // status  1：已使用  2：已过期  0:可用
                let useList = [];
                let usedList = [];
                let overdueList = [];
                for(let item of arr){
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
                    }
                }
                return useList.length
            },
            getAcitivity:function(){
                Promise.all(
                    [
                        this.Service.IActivityService.GetRechargeForCash(), //充值返利
                        // this.Service.IActivityService.GetRechargeForCoupon(),  //优惠券礼包
                        this.Service.IActivityService.GetCouponPackage(),  //买券包
                    ]
                ).then(res=>{
                    let Rechargecash = res[0];
                    let Rechargecoupon = res[1];
                    console.log("Rechargecash",Rechargecash);
                    //充值返利
                    if(Rechargecash.length){this.acitivity.Rechargecash = Rechargecash[0]}
                    //买券包
                    if(Rechargecoupon.length){
                        //处理数据
                        let couponBaoArr = Rechargecoupon.map(d=>{
                            let totalCount = 0;
                            let totalPrice = 0;
                            //计算总额
                            for(let key in d.coupons){
                                let item = d.coupons[key];
                                let price = item.info.price;
                                let count = item.count;
                                let tPrice = parseInt(count*price);
                                totalCount+=item.count;
                                totalPrice += tPrice;
                            }
                            let opt = {
                                id: d.id,
                                totalCount: totalCount,
                                totalPrice: totalPrice,
                            };
                            return opt
                        });

                        //按总金额升序
                        couponBaoArr.sort((pre,curr)=>{
                            return  curr.totalPrice - pre.totalPrice
                        });
                        //计算整个活动优惠券的总数量和总金额
                        let allCount = 0;
                        let allPrice = 0;
                        console.log("couponBaoArr",couponBaoArr);
                        //去除数据最大三个
                        couponBaoArr = couponBaoArr.filter((d,k)=>{
                            allCount+=d.totalCount;
                            allPrice+=d.totalPrice;
                            return k<3
                        });
                        this.acitivity.Rechargecoupon = {list:couponBaoArr,allCount:allCount,allPrice:allPrice}
                    }
                })

            },
            goUrl(url,params){
                this.$router.push({
                    path: url
                })
            },
            getSSoToken:function () {
                this.Service.IMemberService.GetMemberSSoToken().then(d=>{
                    if(d.code===10000 && d.rk){
                        this.paymentCode.code = d.rk;
                        this.paymentCode.popup = true;
                        console.log('ddddd',d);
                    }else{
                        alert(d.msg)
                    }
                });
            }
        }
    };
</script>
<style lang="sass" scoped>
  .user
    background-color: #F4F4F4;
    .mint-popup
      width: 90%;
      border-radius: 4px;
    .qrcode-box
      padding: 0;
      height: 400px;
      min-height: 340px;
      width: 100%;
      /*margin-left: 5%;*/
      text-align: center;
      .code-footer
        font-size: 14px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-top: solid 1px #d5d5d5;
      .code-wrap
        height: 350px;
        .numcode-wrap
          height: 28px;
          font-size: 10px;
          color: #4a4a4a;
          letter-spacing: 2px;
          line-height: 2em;
        .barcode-wrap
          overflow: hidden;
          height: 50px;
          margin-top: 20px;
          canvas
            position: relative;
            top: -10px;
        img
          display: block;
          width: 70%;
          height: auto;
          margin: 0 auto;
    .user-card-wrap
      background: url(../../assets/img/sh/theme/@2x/normal/member-card-bg.png);
      padding: 20px 0 0;
      background-position: 0 0;
      background-size: 100% auto;
      .user-card-container
        background: url(../../assets/img/sh/theme/@2x/normal/vip3.png);
        position: relative;
        width: 305px;
        height: 160px;
        margin: 0 auto;
        border-radius: 8px;
        background-size: 100% 100%;
        .card-vip
          display: flex;
          display: -webkit-flex;
          padding: 15px 0 0 20px;
          .card-discount
            position: absolute;
            top: 70px;
            left: 245px;
            font-weight: bold;
            font-size: 32px;
            color: #715C63;
            letter-spacing: -2px;
            b
              margin-left: 2px;
              font-size: 12px;
              font-weight: normal;
              color: #2F0000;
          .card-vip-pic
            width: 52px;
            height: 52px;
            margin-right: 10px;
            img
              display: block;
              width: 52px;
              height: 52px;
              padding: 2px;
              border-radius: 50%;
              background-color: #DAD8D8;
          .card-vip-message
            padding-top: 3px;
            flex-direction: column;
            justify-content: center;
            p
              padding-top: 5px;
              font-size: 14px;
              color: #61505A;
          .card-vip-integral
            position: absolute;
            top: 10px;
            right: 13px;
            padding: 2px 5px;
            border: 1px solid #906E61;
            border-radius: 4px;
            opacity: 0.55;
            font-size: 12px;
            color: #61505A;
        .card-foot
          position: absolute;
          bottom: 10px;
          right: 20px;
          left: 20px;
          font-size: 12px;
          div
            display: inline-block;
          .card-foot-number
            float: left;
            margin-bottom: 0;
            font-family: Helvetica;
            margin-top: 8px;
            line-height: 1;
            color: #333;
            font-size: 12px;
            letter-spacing: 0;
          .card-foot-qcode
            float: right;
            display: inline-block;
            width: 20px;
            height: 20px;
            background-size: contain;
            background-image: url(../../assets/img/icon_qrcode.png);

      .user-card-grade
        margin-top: -5px;
        position: relative;
        width: 100%;
        height: 110px;
        padding: 1px 0;
        background: #3D3D3D;
        box-shadow: 0 2px 2px 0 #EBEBEB;
        .grade-required
          position: absolute;
          top: 50px;
          left: 50%;
          z-index: 2;
          width: 20px;
          height: 20px;
          margin-left: -10px;
          border-radius: 50%;
          background: #333333;
          border: 2px solid #E9C872;
          color: #E9C872;
          font-size: 12px;
          line-height: 28px;
          text-align: center;
        .grade-member
          position: relative;
          width: 280px;
          height: 50px;
          margin: 35px auto 0;
          text-align: center;
          display: flex;
          display: -webkit-flex;
          .grade-middle-line
            position: absolute;
            top: 22px;
            left: 0;
            width: 100%;
            height: 4px;
            background-image: linear-gradient(90deg, #3D3D3D 0%, #E9C872 50%);
          .grade-line
            flex: 1;
            -webkit-flex: 1;
            h5
              margin: 0 0 20px 0;
              font-size: 14px;
              color: #E9C872;
              letter-spacing: 0;
              bold-weight: normal;
            p
              font-size: 12px;
              color: #999999;
              letter-spacing: 0;
        .grade-upgrade
          position: absolute;
          top: 5px;
          right: 10px;
          font-size: 12px;
          color: #999999;
          letter-spacing: 0;
      .user-card-box
        background-color: #f4f4f4;
      .user-card-menu
        .menu-wrap
          // margin-top: -10px;
          z-index: 2;
          position: relative;
          // width: 360px;
          margin: -10px 10px 10px;
          box-shadow: 0 2px 4px 0 #DCDCDC;
          border-radius: 8px;
          background: #FFF;
          display: flex;
          display: -webkit-flex;
          div
            flex: 1;
            -webkit-flex: 1;
            // height: 100px;
            text-align: center;
            i
              display: block;
              width: 40px;
              height: 40px;
              margin: 10px auto 0;
              background-size: contain;
            .menu-icon-coupon
              background-image: url(../../assets/img/sh/theme/@2x/member-center/i-coupon-g.png);
            .menu-icon-intergal
              background-image: url(../../assets/img/sh/theme/@2x/member-center/i-diamond-g.png);
            .menu-icon-order
              background-image: url(../../assets/img/sh/theme/@2x/member-center/i-notepad-g.png);
            .menu-icon-pay
              background-image: url(../../assets/img/sh/theme/@2x/member-center/i-wallet-g.png);
            .menu-wrap-number
              font-size: 16px;
              color: #333333;
              font-weight: normal;
            .menu-wrap-name
              font-size: 12px;
              color: #999999;
              margin: 0 0 10px;
      .user-card-adv
        .card-adv-activity
          position: relative;
          // width: 360px;
          margin: 0 10px 10px;
          padding: 10px;
          box-shadow: 0 2px 4px 0 #DCDCDC;
          border-radius: 8px;
          background-color: #FFF;
          h3
            font-size: 18px;
            color: #333333;
            padding: 15px 5px;
            line-height: 0;
            margin-top: 0;
            font-weight: noraml;
          .recharge-activity
            position: relative;
            height: 100px;
            padding-top: 10px;
            background: url(../../assets/img/sh/sec-bg-1.png);
            background-size: 100% 100%;
            border: 4px solid #F4F4F4;
            flex-direction: column;
            justify-content: center;
            display: flex;
            display: -webkit-flex;
            .item-link
              position: absolute;
              right: 10px;
              bottom: 10px;
              width: 68px;
              height: 28px;
              border: none;
              background: #FFDD00;
              font-size: 14px;
              border-radius: 20px;
              line-height: 28px;
              text-align: center;
              color: #333;
            .item-content
              display: flex;
              margin-left: 20px;
              font-size: 16px;
              color: #ffffff;
              .menu-icon-crown
                width: 18px;
                height: 16px;
                margin-right: 5px;
                background: url(../../assets/img/sh/i-crown.png);
                background-size: contain;
              &:first-child
                font-size: 24px;
                margin-bottom: 7px;
            &:before
              content: '';
              position: absolute;
              top: 0;
              left: 50%;
              margin-left: -35px;
              width: 70px;
              height: 20px;
              background-image: url(../../assets/img/sh/theme/@2x/member-center/recharge-active.png);
              background-size: contain;
          .package-activity
            position: relative;
            min-height: 100px;
            padding: 20px 15px;
            background: url(../../assets/img/sh/sec-bg-2.png);
            background-size: 100% 100%;
            border: 4px solid #F4F4F4;
            align-items: center;
            .item-title
              margin-bottom: 10px;
              font-size: 24px;
              color: #FFFFFF;
              strong
                color: #FFDD00;
            .item-text
              margin-bottom: 10px;
              font-size: 16px;
              color: #FFFFFF;
              .menu-icon-gift
                float: left;
                width: 18px;
                height: 18px;
                margin-right: 5px;
                background: url(../../assets/img/sh/i-gift-box.png);
                background-size: contain;
            .package-list
              display: flex;
              .package-li
                font-size: 14px;
                width: 70px;
                height: 34px;
                margin-right: 5px;
                padding-top: 20px;
                background: url(../../assets/img/sh/bg-gift-box.png);
                background-size: contain;
                line-height: 1.2;
                color: #333;
                text-align: center;
                strong
                  font-weight: 600;
            .item-link
              position: absolute;
              right: 10px;
              bottom: 10px;
              width: 68px;
              height: 28px;
              border: none;
              background: #FFDD00;
              font-size: 14px;
              border-radius: 20px;
              line-height: 28px;
              text-align: center;
              color: #333;
      .user-card-button
        position: relative;
        // width: 360px;
        margin: 0 10px 10px;
        box-shadow: 0 2px 4px 0 #DCDCDC;
        border-radius: 8px;
        background-color: #FFF;
        .card-button-wrap
          display: flex;
          display: -webkit-flex;
          .nav-button
            flex: 1;
            -webkit-flex: 1;
            // height: 70px;
            margin: 4px 0;
            padding: 15px 0;
            line-height: 40px;
            background-color: #FFF;
            font-size: 16px;
            color: #333333;
            span
              float: left;
              width: 40px;
              height: 40px;
              margin: 0 10px 0 20px;
              border-radius: 50%;
              background: #FFE4D8;
              text-align: center;
              color: #999;
              .user-icon-my
                display: inline-block;
                width: 30px;
                height: 30px;
                margin-top: 2px;
                background-position: 0 -90px;
                background-repeat: no-repeat;
                background-image: url(../../assets/img/sh/theme/@2x/normal/user_center.png);
                background-size: 50px auto;
              .user-icon-order
                background-image: url(../../assets/img/sh/theme/@2x/normal/user_center.png);
                display: inline-block;
                width: 30px;
                height: 30px;
                margin-top: 2px;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 50px auto;
            .user-ion-chevron
              float: right;
              margin-right: 26px;
              color: #999999;
              &:before
                content: "\f125";
                box-sizing: border-box;
                display: inline-block;
                font-family: "Ionicons";
                speak: none;
                font-style: normal;
                font-weight: normal;
                font-variant: normal;
                text-transform: none;
                text-rendering: auto;
                line-height: 1;
                -webkit-font-smoothing: antialiased;

</style>

