



<template>
    <div class="PaySuccess">
        <div class="package-result-body">
            <div class="pay-success"></div>
            <div class="brand-log">
                <img alt="" />
            </div>
            <div class="greeting-context">
                <sup></sup>
                <p>恭喜您获得-<span class="package-name ng-binding">优惠券礼包1</span><span class="package-value ng-binding">（1张券 价值50元）</span> </p>
                <sub></sub>
            </div>
            <div class="link-box">
                <button class="link-to-youhui" @click="goUrl('/user/couponList')">去券包查看</button>
                <button class="link-to-newmenu">去点餐</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaySuccess",
        components: {},
        data(){
            return{
            }
        },
        methods:{
            goUrl(url,params){
                this.$router.push({
                    path: url
                })
            },
        }
    };
</script>
<style lang="scss" scoped>
    .package-result-body{
        padding: 280px 0 0;
        background: #FFF url(../../assets/img/sh/package-success.png) no-repeat center 30px;
        background-size: 260px auto;
        .brand-log {
            width: 48px;
            height: 48px;
            margin: 0 auto 20px;
        }
        .greeting-context {
            width: 300px;
            box-sizing: border-box;
            min-height: 100px;
            margin: 0 auto;
            padding: 20px 0 10px;
            border: 1px solid #E7E7E7;
            box-shadow: 0 2px 4px 0 #E7E7E7;
            border-radius: 2px 0 0 0 2px 2px 2px 0 0;
            font-size: 18px;
            color: #333333;
        }
        sup,sub{
            position: relative;
            vertical-align: baseline;
            font-size: 75%;
            line-height: 0;
        }
        sup {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 0 5px;
            background: url(../../assets/img/sh/theme/@2x/member-center/quotation-left.png) no-repeat;
            background-size: contain;
            vertical-align: top;
            top: -0.5em;

        }
        sub {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 0 5px;
            background: url(../../assets/img/sh/theme/@2x/member-center/quotation-right.png) no-repeat;
            background-size: contain;
            vertical-align: bottom;
            bottom: -0.25em;
        }
        p {
            display: inline-block;
            width: 227px;
            line-height: 1.5;
            .package-name {
                color: #FB8A56;
            }
            .package-value {
                font-size: 14px;
                color: #151515;
            }
        }
        .link-to-youhui, .link-to-newmenu {
            display: block;
            width: 324px;
            height: 50px;
            margin: 20px auto 0;
            background: #E3C48A;
            border-radius: 4px;
            line-height: 50px;
            text-align: center;
            font-size: 16px;
            color: #8C6500;
        }
        .link-to-youhui {
            background: #FFFFFF;
            border: 1px solid #E7E7E7;
            border-radius: 4px;
            font-size: 18px;
            color: #666666;
        }
        .link-to-newmenu {
            background: #FB8A56;
            border-radius: 4px;
            color: #FFF;
        }
    }
</style>

