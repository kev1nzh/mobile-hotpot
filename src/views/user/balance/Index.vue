<template>
    <div class="balance">
        <div class="member-wallet-head">
            <i></i>
            <div class="wallet-info">
                <p class="item-name">我的钱包</p>
                <p class="item-value">￥15080.66</p>
                <p class="item-link" @click="goUrl('/user/balanceHistory')">充值明细</p>
            </div>
        </div>
        <div class="wallet-tabs">
            <div :class="'item ' + (status==='recharge'?'active':'')" @click="updateStatus('recharge')">
                充值优惠
            </div>
            <div :class="'item ' + (status==='any'?'active':'')" @click="updateStatus('any')">
                其他金额
            </div>
            <div :class="'item ' + (status==='friend'?'active':'')" @click="updateStatus('friend')">
                给好友充值
            </div>
        </div>
        <div class="body">
            <Recharge v-if="status==='recharge'" :list="list" :idx="idx" @slected="slected"></Recharge>
            <AnyRecharge v-else-if="status==='any'"></AnyRecharge>
            <RechargeFriend v-else-if="status==='friend'"></RechargeFriend>
        </div>
        <div class="member-wallet-foot">
            <div class="btn-recharge-confirm">
                <p>立即充值</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Recharge from './Recharge';
    import AnyRecharge from './AnyRecharge';
    import RechargeFriend from './RechargeFriend';
    export default {
        name: "balance",

        components: {
            Recharge,
            AnyRecharge,
            RechargeFriend,
        },
        mounted:function(){
            this.init();
        },
        data(){
            return{
                status:'recharge',
                list:[],
                idx:0,
                isShow:false
            }
        },
        methods:{
            init:function(){
                Promise.all([
                    this.Service.IActivityService.GetRechargeForCash(),
                    this.Service.IActivityService.GetRechargeForCoupon(),
                    this.Service.IActivityService.GetRechangeLevel(),
                ]).then(res=>{
                    let list = null;
                    let ForCashData = res[0]||[];
                    let ForCouponData = res[1]||[];
                    let ForLevelData = res[2]||[];
                    list = ForCashData.concat(ForCouponData,ForLevelData);
                    list = list.map(d=>{
                        let coupons = d.coupons||null;
                        let xianjinCnt = 0;
                        let shangpinCnt = 0;
                        let startAmount = (d.startAmount||d.amount);
                        if(coupons){
                            coupons = coupons.map(v=>{
                                let couponInfo = v.couponInfo;
                                if(couponInfo.voucherType===1){
                                    xianjinCnt = xianjinCnt+v.cnt;
                                }
                                if(couponInfo.voucherType===2){
                                    shangpinCnt = shangpinCnt+v.cnt;
                                }
                                return {
                                    cnt:v.cnt,
                                    couponId:v.couponId,
                                    voucherTypeName:couponInfo.voucherTypeName,
                                    voucherType:couponInfo.voucherType,
                                    price:couponInfo.price,
                                }
                            })
                        }
                        let o = {
                            id:d.id,
                            startAmount:startAmount, //出售金额
                            coupons: coupons,   //判断是否送券
                            xianjinCnt: xianjinCnt,   //现金券
                            shangpinCnt: shangpinCnt,   //商品券
                            gradeName:d.gradeName,  //判断是否充值升级
                            balance:d.balance,  //判断是否充值返利
                        };
                        return o
                    });
                    this.list = this.removeItem(list);
                });
            },
            updateStatus(status){
                if(this.status!=status)this.status = status;
            },
            removeItem(arr){
                let list = arr;
                let map = {},
                    dest = [];
                for(let i = 0; i < list.length; i++){
                    let ai = list[i];
                    if(!map[ai.startAmount]){
                        dest.push(ai);
                        map[ai.startAmount] = ai;
                    }else{
                        for(let j = 0; j < dest.length; j++){
                            let dj = dest[j];
                            if(dj.startAmount === ai.startAmount){
                                dest[j] = {
                                    id:dj.id||ai.id,
                                    startAmount:dj.startAmount||ai.startAmount, //出售金额
                                    coupons: dj.coupons||ai.coupons,   //判断是否送券
                                    xianjinCnt: dj.xianjinCnt||ai.xianjinCnt,   //现金券
                                    shangpinCnt:  dj.shangpinCnt||ai.shangpinCnt,   //商品券
                                    gradeName:dj.gradeName||ai.gradeName,  //判断是否充值升级
                                    balance:dj.balance||ai.balance,  //判断是否充值返利
                                };
                                break;
                            }
                        }
                    }
                }
                return dest
            },
            slected:function(data){
                this.idx = data.idx;
            },
            goUrl(url,params){
                this.$router.push({
                    path: url
                })
            },
        }
    };
</script>
<style lang="scss" scoped>
    .balance{
        min-height: 100vh;
        overflow: hidden;
        clear: both;
        background-color: #fff;
        position: relative;
        z-index: 1;
    }
    .member-wallet-head {
        display: flex;
        display: -webkit-flex;
        height: 100px;
        border-bottom: 6px solid #EEE;
        i {
            width: 60px;
            height: 63px;
            margin: 15px 52px 0 44px;
            background: url(../../../assets/img/sh/theme/@2x/member-center/i-online-wallet.png) no-repeat;
            background-size: 100% 100%;
        }
        .wallet-info {
            flex: 1;
            -webkit-flex: 1;
            padding-top: 15px;
            p {
                margin-bottom: 5px;
            }
        }
        .item-name {
            font-size: 14px;
            color: #999999;
        }
        .item-value {
            font-size: 18px;
            color: #333333;
        }
        .item-link {
            font-size: 12px;
            color: #2E8DFF;
        }
    }
    .wallet-tabs{
        display: flex;
        display: -webkit-flex;
        height: 44px;
        font-size: 14px;
        .item{
            flex: 1;
            -webkit-flex: 1;
            line-height: 44px;
            text-align: center;
            border-bottom: 1px solid #EEE;
            color: #3a3a3a;
        }
        .item.active {
             border-color: #FB8A56;
        }
    }
    .member-wallet-foot {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 5px 0;
        box-shadow: 0 2px 9px 0 #E2E2E2;
        .btn-recharge-confirm {
            height: 48px;
            margin: 0 15px;
            border-radius: 4px;
            background: #FB8A56;
            box-shadow: 0 3px 4px 0 #FFF5DA;
            text-align: center;
            line-height: 48px;
            font-size: 16px;
            color: #FFFFFF;
        }
    }
</style>

