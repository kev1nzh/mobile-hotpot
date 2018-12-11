

<template>
    <li>
        <div class="itemsMsg">
            <div class="price">
                <p>
                    <span class="del" v-if="data.paidFee!=data.unitPrice">¥{{data.unitPrice}}</span>
                    ￥{{data.paidFee}}
                </p>
            </div>
            <div class="copies">
                <p><span>x</span>{{data.cnt}}</p>
            </div>
            <div class="title">
                <p class="name">
                    <span class="label" v-if="data.freeProsCnt">[赠菜]</span>
                    <span class="label" v-if="data.tips">{{data.tips}}</span>
                    <span>{{data.productName}} <b class="subName" v-if="data.scaleName">【{{data.scaleName}}】</b></span>
                    <span class="itemType" v-if="data.isItemTypeText">{{data.itemTypeText}}</span>
                </p>
            </div>
        </div>
        <div class="subItemsMsg" v-if="data.components" v-for="(item,index) in data.components" :key="index">
            <div class="price" v-if="item.isShowName">
                <p>
                    ￥{{item.fee}}
                </p>
            </div>
            <div class="copies" v-if="item.isShowName">
                <p><span>x</span>{{item.cnt}}</p>
            </div>
            <div class="title">
                <p class="name">
                    <span class="label" v-if="item.isShowName">{{item.componentName}}</span>
                    <span>{{item.name}}</span>
                </p>
            </div>
        </div>
        <div class="subItemsMsg" v-if="data.products" v-for="(item,index) in data.products" :key="index">
            <div class="price">
                <p>
                    <span class="del" v-if="item.paidFee!=data.unitPrice">¥{{item.unitPrice}}</span>
                    ￥{{item.paidFee}}
                </p>
            </div>
            <div class="copies">
                <p><span>x</span>{{item.cnt}}</p>
            </div>
            <div class="title">
                <p class="name">
                    <span class="label" v-if="item.tips">{{item.tips}}</span>
                    <span>{{item.productName}}
                        <b class="subName" v-if="item.scaleName">【{{item.scaleName}}】</b>
                        <b class="subName" v-if="item.components.length">
                            ({{returnSubName(item.components)}})
                        </b>
                    </span>
                </p>
            </div>
        </div>
    </li>
</template>
<script>
    export default {
        name: "DetailItem",
        props: {
            data:{
                type:Object,
                required: true
            },
        },
        components: {

        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {
            returnSubName:function (arr) {
                let text = arr.map((v,k)=>{
                    let price = Number(v.fee);
                    return v.name+(price?(' ￥'+price):'')
                });
                text = text.join('，');
                return text
            }
        }
    };
</script>
<style lang="scss" scoped>
    li{
        margin-bottom: 0;
        clear: both;
        overflow: hidden;
        position: relative;
        background: #fff;
        padding: 5px 15px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
        .itemsMsg,subItemsMsg{
            clear: both;
            overflow: hidden;
        }
        .label{
            color: #d0011b;
            padding-right: 5px;
        }
        .del{
            font-size: 12px;
            color: #999;
            text-decoration: line-through;
        }
        .title{
            overflow: hidden;
            display: block;
            padding-right: 8%;
        }
        .price{
            float: right;
            width: 40%;
            text-align: right;
        }
        .copies{
            float: right;
            width: 30px;
        }
        .itemsMsg{
            color: #333;
            font-size: 14px;
        }
        .subItemsMsg{
            color: #999;
            font-size: 12px;
        }
        .subName{
            color: #999;
            font-size: 12px;
        }
        .itemType{
            padding: 0 8px;
            color: #fff;
            font-size: 12px;
            border-radius: 50px;
            background: #E8552B;
            margin-left: 8px;
        }
    }
</style>

