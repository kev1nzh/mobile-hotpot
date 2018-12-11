



<template>
    <div class="PayCouponItem">
        <dl class="coupon-content">
            <dt class="rules-info">
                <p><b>{{data.info.price}}</b><sub>元</sub></p>
            </dt>
            <dd class="coupon-detail">
                <div class="name ">{{data.info.name}}</div>
                <div class="coupon-type-time">
                    <span class="type ">{{data.info.voucherTypeName}}</span>
                    <span class="time ">领券后{{data.info.day}}天内有效</span>
                </div>
                <div class="store " style="display: none" v-show="isShow" >
                    <span class="type">门店范围</span>
                    <span style="vertical-align: 3px;" class="detail" v-if="data.info.storeAll===1">
                        <b>所有门店</b>
                    </span>
                    <span style="vertical-align: 3px;" class="detail" v-else-if="data.info.storeId.length">
                        <b v-for="item in data.info.storeId" :key="item.storeId">{{brands[item.storeId].name}}</b>
                    </span>
                </div>
                <i class="ion-ios-arrow-down" @click="showMore" v-if="(data.info.storeAll===1||data.info.storeId.length)">{{isShow?'收起':'展开'}}</i>
            </dd>
            <dd class="coupon-cnt">{{data.count}}<span class="unit">张</span></dd>
        </dl>
    </div>
</template>

<script>
    export default {
        name: "PayCouponItem",
        props:{
            brands:{
                type:Object,
                required: true
            },
            data:{
                type: Object,
                required: true
            }
        },
        components: {},
        data(){
            return{
                isShow:false,
            }
        },
        methods:{
            showMore:function () {
                this.isShow=!this.isShow;
            },
        }
    };
</script>
<style lang="scss" scoped>
    .coupon-content {
        position: relative;
        overflow: hidden;
        margin: 0 10px 10px;
        border: 1px solid #EBEBEB;
        box-shadow: 0 2px 4px 0 rgba(208, 207, 207, 0.5);
        border-radius: 4px;
        min-height: 80px;
        background: #FFFFFF;
    }
    .rules-info {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 110px;
        height: 100%;
        background-color: #515151;
        text-align: center;
        font-weight: normal;
        p {
            width: 100%;
            color: #E9C872;
            font-size: 14px;
        }
        b {
            color: #E9C872;
            font-size: 24px;
            vertical-align: middle;
            font-weight: normal;
        }
        sub {
            font-size: 12px;
            vertical-align: middle;
            position: relative;
            bottom: -0.3em;
        }
    }
    .coupon-detail {
        display: inline-block;
        margin-top: 13px;
        margin-left: 130px;
        .store{
            clear: both;
            overflow: hidden;
        }
        .ion-ios-arrow-down{
            position: absolute;
            top: 46px;
            right: 23px;
            font-size: 12px;
            font-style: normal;
        }
        .name {
            margin-bottom: 7px;
            font-size: 18px;
            color: #333333;
        }
        .type {
            float: left;
            margin-right: 10px;
            color: #999999;
            font-size: 13px;
        }
        .coupon-type-time {
            font-size: 13px;
            .time {
                color: #FB8A56;
            }
        }
        .detail {
            float: left;
            display: inline-block;
            width: 160px;
            white-space: initial;
            font-size: 12px;
            color: #666666;
            vertical-align: 3px;
            b {
                font-size: 12px;
                color: #666666;
            }
        }
    }
    .coupon-detail > div:not(.name) {
        margin-bottom: 5px;
    }
    .coupon-cnt {
        display: flex;
        position: absolute;
        top: 12px;
        right: -25px;
        width: 80px;
        height: 16px;
        background: #FF8C57;
        font-size: 14px;
        line-height: 16px;
        color: #FFFFFF;
        align-items: center;
        justify-content: center;
        transform: rotate(39deg);
        transform-origin: 50% 50%;
        .unit {
            display: inline-block;
            margin-left: 2px;
            color: #FFFFFF;
            font-size: 20px;
            transform: scale(0.5);
            transform-origin: 0 50%;
        }
    }
</style>

