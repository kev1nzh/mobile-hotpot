<template>
    <div :class="'couponItem ' +((data.status===0)?'':'not')">
        <dl class="container">
            <dt class="rules-info">
                <p><b class="ng-binding">{{data.price}}</b><sub>元</sub></p>
            </dt>
            <dd class="coupon-detail">
                <div class="name ng-binding">{{data.name}}</div>
                <div class="coupon-type-time">
                    <span class="type ng-binding">{{data.voucherTypeName}}</span>
                    <span class="time ng-binding">{{moment(data.endTime).format("YYYY-MM-DD")}}到期</span>
                </div>
                <div class="store " style="display: none" v-show="isShow">
                    <div v-if="data.stores && data.stores.length">
                        <span class="type">门店范围</span>
                        <span style="vertical-align: 3px;" class="detail">
                            <b class="ng-binding" v-for="item in data.stores" :key="item.storeId"> {{item.storeName}} </b>
                        </span>
                    </div>
                    <div v-if="data.products">
                        <span class="type">适用商品</span>
                        <span style="vertical-align: 3px;" class="detail">
                            <b class="ng-binding" v-for="(item,index) in data.products" :key="index" v-if="product[item.productId] && product[item.productId].base && product[item.productId].base.name"> {{product[item.productId].base.name}} </b>
                        </span>
                    </div>
                </div>
                <i class="ion-ios-arrow-down" @click="showMore" v-if="data.stores && data.stores.length">{{isShow?'收起':'展开'}}</i>
            </dd>
            <dd>
                <div class="go-menu ng-binding">{{getStatusName()}}</div>
                <div class="increase" v-if="data.status===1"><i class="iconfont increase-icon"></i>转赠</div>
            </dd>
        </dl>

    </div>
</template>

<script>
    export default {
        name: "couponItem",
        components: {},
        props:{
            product:{
                type:Object,
                required: true
            },
            data:{
                type: Object,
                required: true
            }
        },
        data(){
            return{
                isShow:false
            }
        },
        methods:{
            showMore:function () {
                this.isShow=!this.isShow;
            },
            getStatusName(){
                let text = '';
                switch (this.data.status) {
                    case 0:
                        text = '立即使用';
                        break;
                    case 1:
                        text = '已使用';
                        break;
                    case 2:
                        text = '已过期';
                        break;
                    case 3:
                        text = '使用时间未到';
                        break;
                    default:
                        text = '暂不可用';
                        break;
                }
                return text
            },
        }
    };
</script>
<style lang="scss" scoped>
    dt, dd {
        line-height: 1.42857;
    }
    .couponItem.not{
        filter: grayscale(100%);
    }
    .couponItem{
        background-color: #fff;
        color: #444;
        position: relative;
        z-index: 2;
        display: block;
        margin: -1px;
        font-size: 16px;
        padding: 10px 6px 0;
    }
    .container{
        position: relative;
        min-height: 110px;
        margin-bottom: 10px;
        background: #FFFFFF;
        border: 1px solid #DAD8D8;
        border-radius: 4px;
        overflow: hidden;
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
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    .rules-info p:first-child {
        margin-bottom: 10px;
    }
    .rules-info p {
        width: 100%;
        color: #E9C872;
        font-size: 14px;
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
            top: 4px;
            right: -3px;
        }
    }
    p {
        margin: 0 0 10px;
    }
    .coupon-detail {
        display: inline-block;
        margin-top: 13px;
        margin-left: 130px;
        .ion-ios-arrow-down {
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
        .coupon-type-time {
            font-size: 13px;
            margin-bottom: 5px;
            .type {
                float: left;
                margin-right: 10px;
                color: #999999;
                font-size: 13px;
            }
            .time {
                color: #FB8A56;
            }
        }
        .detail {
            display: inline-block;
            width: 160px;
            white-space: initial;
            font-size: 12px;
            color: #666666;
            vertical-align: 3px;
        }
    }
    .go-menu {
        margin-left: 110px;
        padding: 5px 0;
        border-top: 1px #DAD8D8 dashed;
        text-align: center;
        font-size: 12px;
        color: #2E8DFF;
        line-height: 30px;
    }
    .increase {
        background: #FFFBF1;
        border: 1px solid #FFEAC1;
        border-radius: 15px;
        width: 65px;
        height: 22px;
        font-size: 12px;
        color: #FFB853;
        position: absolute;
        top: 10px;
        right: 10px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
        .increase-icon {
            margin-right: 5px;
            width: 11px;
            height: 11px;
            position: relative;
            top: 1px;
        }
    }
    .store{
        margin-bottom: 5px;
        .type {
            float: left;
            margin-right: 10px;
            color: #999999;
            font-size: 13px;
        }
        .detail {
            display: inline-block;
            width: 160px;
            white-space: initial;
            font-size: 12px;
            color: #666666;
            vertical-align: 3px;
            b {
                font-size: 12px;
                color: #666666;
                font-weight: 500;
            }
        }
    }
</style>

