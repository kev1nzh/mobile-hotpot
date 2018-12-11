<template>
    <div class="recharge">
        <div  v-for="(item,index)  in list"  :class="'option '+(index===idx?'act':'')" :key="index" @click="slected(item,index)">
            <div class="box">
                <p class="item-name ">￥{{item.startAmount}}</p>
                <p class="item-intro " >售价￥{{item.startAmount}}</p>
                <p class="item-upgrade " v-if="item.gradeName">充值即升级"{{item.gradeName}}"</p>
                <p class="item-addtions" v-if="item.coupons">
                    可得
                    <span v-if="item.xianjinCnt">{{item.xianjinCnt}}张现金券 &nbsp;</span>
                    <span v-if="item.shangpinCnt">{{item.shangpinCnt}}张现金券</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Recharge",
        components: {},
        data(){
            return{
                isShow:false
            }
        },
        props: {
            list: {
                type: Array
            },
            idx: {
                type: Number
            },
        },
        methods:{
            slected(item,index){
                this.$emit('slected',{
                    data:item,
                    idx:index
                });

            },

        }
    };
</script>
<style lang="scss" scoped>
    .recharge:after {
        content: '';
        flex: 1 1 35%;
        -webkit-flex: 1 1 35%;
        height: 100px;
        margin: 20px 10px 0;
    }
    .recharge{
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        .option:after,.option:before {
            content: '';
            position: absolute;
            top: 30px;
            left: -10px;
            width: 20px;
            height: 20px;
            border: 1px solid #E6E6E6;
            border-radius: 50%;
            background-color: #FFF;
        }
        .option.act:after,.option.act:before{
            border: 1px solid #FB8A56;
        }
        .option:after{
            left: auto;
            right: -10px;
        }
        .option {
            position: relative;
            overflow: hidden;
            flex: 1 1 35%;
            -webkit-flex: 1 1 35%;
            height: 110px;
            margin: 20px 10px 0;
            text-align: center;
            .box{
                height: 108px;
                border: 1px solid #E6E6E6;
                border-radius: 10px;
            }
        }
        .option.act .box{
            border: 1px solid #FB8A56;
        }
        .act .item-name{
            border-bottom: 1px dashed #FB8A56;
        }
        .item-name {
            height: 40px;
            font-size: 20px;
            color: #333333;
            line-height: 40px;
            border-bottom: 1px dashed #E6E6E6;
        }
        .item-intro {
            margin: 2px 0;
            font-size: 14px;
            color: #666666;
            letter-spacing: -1px;
            span {
                color: #999;
            }
        }
        .item-upgrade {
            font-size: 10px;
            color: #FF8C57;
        }
        .item-upgrade:before {
            content: '';
            display: inline-block;
            width: 15px;
            height: 12px;
            background: url(../../../assets/img/sh/i-crown-og.png) no-repeat 0 0;
            background-size: contain;
        }
        .item-addtions {
            font-size: 12px;
            color: #A38955;
            letter-spacing: -1px;
        }
    }
</style>

