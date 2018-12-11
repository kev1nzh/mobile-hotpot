<template>
    <div class="payCoupon">
        <div v-if="list.length">
            <div class="header">
                <div class="bg-header">
                    <img src="../../assets/img/sh/header-bg-1.png" alt="图片1">
                </div>
                <div class="bg-flower">
                    <img src="../../assets/img/sh/header-bg-decor.png" alt="图片2">
                </div>
                <div class="bg-box">
                    <div class="value-text">
                        {{list[idx].totalCount}}张券 价值{{list[idx].totalPrice}}元
                    </div>
                </div>
                <div class="activities-nav-box">
                    <ul class="activities-nav">
                        <li  v-for="(item,index) in list" :class="index===idx?'selected':''" :key="item.id" @click="updateIndex(index)">
                            <p class="price"><b>{{item.totalPrice}}</b>元</p>
                            <p>礼包</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="package-brief">
                <div class="avi-name">礼包名称：{{list[idx].name}}</div>
                <div class="avi-time">活动时间：2018-08-28 至 2018-12-31</div>
            </div>
            <div class="package-detail">
                <div class="sub-title">礼包内容</div>
                <div class="coupon-list" v-if="list[idx].coupons.length">
                    <PayCouponItem v-for="item in list[idx].coupons" :data="item" :brands="brands" :key="item.id"></PayCouponItem>
                </div>
            </div>
            <div class="footer-cum">
                <div class="footer">
                    <div class="shopping-bar">
                        <div class="shopping-lt">
                            <div class="package-quantity ">
                                {{list[idx].totalCount}}张券
                            </div>
                            <div class="package-price ">
                                ￥{{list[idx].price}}
                            </div>
                        </div>
                        <div class="shopping-rt">
                            <button class="btn-shopping" @click="goUrl('/activity/coupon/success')">立即购买</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PayCouponItem from './PayCouponItem';
    export default {
        name: "PayCoupon",
        components: {
            PayCouponItem
        },
        data(){
            return{
                list:[],
                idx: 0,
                brands:{},
            }
        },
        mounted:function(){
            this.init();
        },
        methods:{
            init:function(){
                this.Service.IBrandService.GetBrandStores().then(d=>{
                    try {
                        let opt = {};
                        for (let item of d.result.data){
                            opt[item.id] = item;
                        }
                        this.brands = opt;
                        console.log("opt",opt);
                    }catch (e) {
                        console.error("GetBrandStores数据处理出错");
                    }
                    return this.Service.IActivityService.GetCouponPackage()
                }).then(d=>{
                    if(d && d.length){
                        let list = this.matchData(d);
                        this.list = list;
                        console.log(list);
                    }
                });

            },
            matchData:function(arr){
                let couponBaoArr = arr.map(d=>{
                    let totalCount = 0;
                    let totalPrice = 0;
                    let data = d;
                    let coupons = [];
                    //计算总额
                    for(let key in d.coupons){
                        let item = d.coupons[key];
                        let price = item.info.price;
                        let count = item.count;
                        let tPrice = parseInt(count*price);
                        totalCount+=item.count;
                        totalPrice += tPrice;
                        try {
                            item.info.storeId = JSON.parse(item.info.storeId);
                        }catch (e) {
                            item.info.storeId = [];
                            console.error('item.info.storeId无法转为数组');
                        }
                        coupons.push(item);
                    }
                    data.totalCount = totalCount;
                    data.totalPrice = totalPrice;
                    data.coupons = coupons;
                    return data
                });
                //按总金额升序
                couponBaoArr.sort((pre,curr)=>{
                    return  curr.totalPrice - pre.totalPrice
                });
                return couponBaoArr
            },
            goUrl(url,params){
                this.$router.push({
                    path: url
                })
            },
            updateIndex:function (idx) {
                this.idx = idx;
                console.log(this.list[idx].coupons[0].info);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .payCoupon{
        background-color: #f4f4f4;
        .header{
            position: relative;
            z-index: 1;
            img{
                display: block;
                width: 100%;
                height: auto;
            }
            .bg-header{
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
            }
            .bg-flower{
                position: absolute;
                left: 0;
                top: 0;
                z-index: 3;
            }
            .bg-box{
                position: relative;
                left: 0;
                top: 0;
                z-index: 4;
                width: 100%;
                height: 13rem;
                overflow: hidden;
                background-image: url(../../assets/img/sh/i-box-bg.png);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center 10px;
            }
            .value-text {
                position: absolute;
                left: 50%;
                top: 8rem;
                margin-left: -5.5rem;
                z-index: 5;
                width: 11rem;
                height: 2rem;
                background: #FFFFFF;
                border-radius: 30px;
                text-align: center;
                line-height: 2rem;
                font-size: 20px;
                font-weight: bold;
                color: #FD6F2E;
            }
        }
        .activities-nav{
            overflow-y: hidden;
            overflow-x: auto;
            display: flex;
            margin-bottom: 10px;
            padding: 0 10px;
            li.selected {
                background-image: url(../../assets/img/sh/package-bg-select.png);
            }
            li.selected:before {
                content: '';
                position: absolute;
                top: 5px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: url(../../assets/img/sh/i-check-bk.png);
                background-size: contain;
            }
            li {
                position: relative;
                flex: 0 0 115px;
                width: 115px;
                height: 60px;
                background: url(../../assets/img/sh/package-bg.png) no-repeat 0 0;
                background-size: contain;
                margin-right: 25px;
                padding-top: 30px;
                border-radius: 4px;
                letter-spacing: 1px;
                font-size: 12px;
                text-align: center;
                color: #FFFFFF;
                .price {
                    font-size: 16px;
                }
                b {
                    color: #FFF;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
        .package-brief {
            margin-bottom: 10px;
            text-align: center;
            .avi-name {
                font-size: 14px;
                color: #333333;
            }
            .avi-time {
                font-size: 12px;
                color: #FF8C57;
            }
        }
        .package-detail{
            .sub-title {
                display: flex;
                margin-bottom: 10px;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
            .sub-title:before {
                content: '';
                width: 25px;
                height: 1px;
                margin-right: 5px;
                background-color: #5E320E;
            }
            .sub-title:after {
                content: '';
                width: 25px;
                height: 1px;
                margin-left: 5px;
                background-color: #5E320E;
            }
        }
        .footer-cum{
            height: 65px;
            display: block;
        }
        .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            background: #FFF;
            width: 100%;
            height: 60px;
            .shopping-bar {
                display: flex;
                width: 100%;
                height: 60px;
                .shopping-lt {
                    flex: 1;
                    padding-left: 20px;
                }
                .shopping-rt {
                    flex: 0 0 140px;
                }
                .package-quantity {
                    margin: 10px 0 2px;
                    font-size: 14px;
                    color: #999999;
                }
                .package-price {
                    font-size: 18px;
                    color: #FF8C57;
                    letter-spacing: -1px;
                }
                .btn-shopping {
                    display: block;
                    width: 120px;
                    height: 40px;
                    margin: 10px auto 0;
                    background: #FF8C57;
                    border-radius: 4px;
                    font-size: 16px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                }
            }
        }
    }
</style>

