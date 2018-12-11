<template>
    <div class="integral">
        <div class="integral-top" ref="integralTop">
            <p class="item-title">总积分</p>
            <p class="item-value ">{{integral.totalIntegral}}</p>
            <p class="item-tip ">可抵现金{{integral.amount}}元</p>
            <p class="item-rule " ><i></i>{{integral.changeIntegral}}积分={{integral.changeAmount}}元</p>
        </div>
        <div class="listWrap" v-if="height" :style="{height:height+'px'}">
            <Scroll
                    v-if="list.length"
                    :data="list"
                    :isMore="isMore"
                    @pullingUp="pullingUp"
                    @pullingDown="pullingDown"
            >
                <ul>
                    <li v-for="(item,index) in list" :key="index">
                        <div class="log-info">
                            <div class="log-name">
                                <span>{{item.integralTypeName}}</span>
                            </div>
                            <div class="log-date ">
                                {{moment(item.created).format("YYYY-MM-DD hh:mm")}}
                            </div>
                        </div>
                        <span :class="'log-cnt ' +(item.cnt>0?'':'minus-log')">
                          <b>{{(item.cnt>0)?'+':''}}{{item.cnt}}</b>
                    </span>
                    </li>
                </ul>
            </Scroll>
            <div v-else class="notData">
                暂无信息
            </div>
        </div>
    </div>
</template>

<script>
    import Scroll from '../../../public_comp/Scroll'

    export default {
        name: "integral",
        components: {
            Scroll
        },
        data:function(){
            return{
                list:[],
                integral:{
                    totalIntegral:0,
                    amount:0,
                    changeIntegral:0,
                    changeAmount:1,
                },
                isMore:true,
                page: 0,
                height:false,
            }
        },
        mounted() {
            this.$nextTick(()=>{
                let integralTop = this.$refs.integralTop;
                this.height = document.documentElement.clientHeight-integralTop.offsetHeight;
                this.init();
            })
        },
        methods:{
            init:function(){
                Promise.all([
                    this.getIntegra(0),
                    this.getIntegra(1),
                    this.getIntegra(2),
                    this.getIntegralRule(),
                    this.getUserData(),
                ]).then(res=>{
                    let res1 = res[0];
                    let res2 = res[1];
                    let res3 = res[2];
                    let integralData = res[3];
                    let userData = res[4];
                    //计算积分金额
                    let totalIntegral = userData.integral;
                    let changeIntegral = integralData.base.discount.integral;
                    let amount = (totalIntegral/changeIntegral).toFixed(2);
                    //注入积分金额
                    this.integral.totalIntegral = totalIntegral;
                    this.integral.amount = amount;
                    this.integral.changeIntegral = changeIntegral;
                    if(res3.length<10){
                        this.isMore = false;
                    }else{
                        this.isMore = true;
                    }
                    this.page = 2;
                    this.list = [].concat(res1,res2,res3);
                });
            },
            pullingUp:function () {
                console.log("pullingUp");
                this.page = this.page+1;
                this.getIntegra().then(res=>{
                    this.list = res.concat(this.list);
                    console.log(res);
                    if(res.length<10){
                        this.isMore = false;
                    }
                });
            },
            pullingDown:function () {
                this.init();
            },
            getIntegralRule:function(){
                return this.Service.IActivityService.GetIntegralRule()
            },
            getUserData:function(){
                return this.Service.IMemberService.GetMemberInfoByToken()
            },
            getIntegra:function (page) {
                return this.Service.IMemberService.GetIntegralList({
                    page: page||this.page,
                });

            }
        }
    };
</script>
<style lang="scss" scoped>
    .notData {
        width: 7.4rem;
        margin: 30px auto;
        padding-top: 8.5rem;
        background: url(../../../assets/img/coupon-blank.png) no-repeat 0 0;
        background-size: 100% auto;
        font-size: 16px;
        text-align: center;
        color: #666;
    }
    .integral{
        position: relative;
        z-index: 1;
    }
    .integral-top {
        height: 11rem;
        background: #FFF url(../../../assets/img/my-integral-bg.png) no-repeat 0 0;
        background-size: 100% auto;
        text-align: center;
        line-height: 1;
        color: #FFFFFF;
        .item-tip{
            margin-top: 10px;
            font-size: 14px;
        }
        .item-title {
            margin-bottom: 5px;
            padding-top: 78px;
            background: url(../../../assets/img/i-integral.png) no-repeat center 20px;
            background-size: 48px 48px;
            font-size: 18px;
        }
        .item-value {
            font-size: 40px;
        }
        .item-rule {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 14px;
            i {
                display: inline-block;
                width: 15px;
                height: 15px;
                margin-right: 5px;
                background: url(../../../assets/img/i-rule.png) no-repeat 0 0;
                background-size: contain;
                vertical-align: -3px;
            }
        }
    }
    .listWrap{
        position: relative;
        z-index: 1;
        height: 100vh;
        overflow: hidden;
        li{
            background-color: #fff;
            display: flex;
            display: -webkit-flex;
            height: 60px;
            margin: 0 20px;
            padding: 12px 0 0;
            border-bottom: 2px solid #F5F5F5;
            align-items: center;
            .log-info {
                display: flex;
                display: -webkit-flex;
                justify-content: center;
                align-items: left;
                flex-direction: column;
                flex: 1;
                -webkit-flex: 1;
            }
            .log-name {
                font-size: 14px;
                span {
                    color: #333;
                }
            }
            .log-date {
                font-size: 12px;
                color: #999;
            }
            .log-cnt.minus-log{
                b {
                    color: #EB6125;
                }
            }
            .log-cnt {
                width: 100px;
                text-align: right;
                font-size: 16px;

                b {
                    color: #333333;
                    font-weight: 500;
                }
            }
        }
    }
</style>

