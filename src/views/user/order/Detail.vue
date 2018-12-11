<template>
    <div class="orderDetail">
        <div class="remind" v-if="orderMsg.status==='Pending'">餐品已下厨,请耐心等待上菜哦!</div>
        <div class="order-infos">
            <div>
                <span class="store-name ">NO.{{orderMsg.nono}}</span>
                <span class="status pending">{{orderMsg.statusName}}</span>
            </div>
            <div>
                <span>门店:{{orderMsg.subject}}</span>
                <span>{{orderMsg.dateTime}}</span>
            </div>
            <div>
                <span>桌号:{{orderMsg.deskId}}</span>
                <span>就餐人数:{{orderMsg.person}}人</span>
            </div>
        </div>
        <div class="sec-order-details">
            <ul v-if="showItems">
                <DetailItem v-for="item in showItems" :data="item" :key="item.id"></DetailItem>
            </ul>
        </div>
        <div class="sec-order-details gray" v-if="extrasList">
            <ul>
                <li v-for="(item,index) in extrasList" :key="index">
                    <div class="price">
                        <p>
                            ￥{{item.paidFee}}
                        </p>
                    </div>
                    <div class="copies">
                        <p><span>x</span>{{item.cnt}}</p>
                    </div>
                    <div class="title">
                        <p class="name">
                            <span>{{item.productName}}</span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="sec-order-addition">
            <div class="item-lt">
                优惠券
            </div>
            <div class="item-rt">
                无可用优惠券 &gt;
            </div>
        </div>
        <div class="total-price" v-if="orderMsg.paidFee">
            <p>小计：<span>¥{{orderMsg.paidFee.toFixed(2)}}</span></p>
        </div>
        <div class="bar-footer-cum" v-if="orderMsg.status==='Pending'">
            <div class="cum"></div>
            <div class="bar-footer">
                <div class="button-box">
                    去支付
                </div>
                <div class="price-info">
                    <span class="name">需付：</span>
                    <span class="price">¥{{orderMsg.paidFee.toFixed(2)}}</span>
                    <span class="del">优惠¥{{parseInt(orderMsg.originalPrice-orderMsg.paidFee)}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DetailItem from './DetailItem'
    export default {
        name: "OrderDetail",
        components: {
            DetailItem
        },
        data(){
            //获得订单id
            let query = this.$route.query||{};
            return{
                query:query,
                orderMsg:{},
                productList: [],
                extrasList: [],
                showItems: [],
            }
        },
        mounted() {
            this.getOrderDetail();
        },
        methods:{
            getOrderDetail:function () {
                this.Service.IOrderService.GetOrderDetail(this.query.orderId).then(d=>{
                    console.log("GetOrderDetail",d);
                    //获取订单基本信息
                    let orderMsg = this.getOrderMsg(d);
                    //获取退菜数据
                    let refundPros = d.refundPros?this.getRefundList(d.refundPros):null;
                    //获取赠菜数据
                    let freePros = d.freePros?this.getFreeList(d.freePros):null;
                    //处理订单商品数据
                    let productList = d.products?this.getProductList({
                        refundPros:refundPros,
                        freePros:freePros,
                        products:d.products
                    }):null;
                    //获取展示商品列表
                    let showItems = productList?this.getShowItems(productList):null;
                    //获取附加费
                    let extrasList = productList?this.getExtraList(productList):null;
                    console.log(productList);
                    console.log(showItems);
                    console.log(extrasList);
                    this.orderMsg = orderMsg;   //获取订单信息
                    this.productList = productList;  //处理好的产品信息
                    this.extrasList = extrasList;  //服务费列表
                    this.showItems = showItems; //展示商品列表
                });
            },
            getRefundList:function(arr){
                let list = arr.map(d=>{
                    return {productId:d.productId,cnt:d.isRefund,amount:d.refundAmount};
                });
                return list
            },
            getFreeList:function(arr){
                let list = arr.map(d=>{
                    return {productId:d.productId,cnt:d.cnt,amount:d.amount};
                });
                return list
            },
            getOrderStatus:function (state) {
                let name = '';
                switch (state) {
                    case "Success":
                        name = '已支付';
                        break;
                    case "Pending":
                        name = '待付款';
                        break;
                    case "Cancel":
                        name = '已取消';
                        break;
                }
                return name
            },
            getOrderMsg:function (d) {
                let data = d||{};
                let orderMsg = {
                    nono: data.nono,   //编号
                    status: data.status, //订单状态
                    statusName: this.getOrderStatus(data.status), //订单状态
                    subject: data.subject, //门店名称
                    dateTime: this.moment(data.dateTime).format("YYYY-MM-DD hh:mm"),  //下单时间
                    deskId: data.deskId, //桌号
                    person: data.person, //就餐人数
                    paidFee: data.paidFee, //应付金额
                    originalPrice: data.originalPrice, //原价
                };
                return orderMsg
            },
            getComponents:function(obj){
                let components = obj.components;
                let freeProsData = obj.freeProsData;
                let refundProsData = obj.refundProsData;


                return components.map(d=>{
                    let isShow = Number(d.fee)>0;
                    //判断是否为赠菜
                    let freeProsCnt =  0;
                    if(freeProsData && freeProsData.length){
                        let freeProsOpt = freeProsData.find(value=>{
                            return value.productId===d.productId
                        });
                        if(freeProsOpt){freeProsCnt = freeProsOpt.cnt}
                    }
                    //判断是否为退菜
                    let refundCnt =  0;
                    if(refundProsData && refundProsData.length){
                        let refundOpt = refundProsData.find(value=>{
                            return value.productId===d.productId
                        });
                        if(refundOpt){refundCnt = refundOpt.cnt}
                    }
                    return{
                        fee: d.fee, //金额
                        name: d.name, //商品名
                        componentName: d.componentName ||'', //作用功能
                        cnt: d.cnt, //份数
                        isShowName: isShow,  //是否显示componentName
                        freeProsCnt: freeProsCnt,  //赠菜份数 0不是赠菜
                        refundCnt: refundCnt,  //退菜份数  0不是退菜
                    }
                })

            },
            getProductList:function (obj) {
                let refundProsData = obj.refundPros;
                let freeProsData = obj.freePros;
                let productsData = obj.products;
                let products = productsData.map(value=>{
                    //判断是否为退菜
                    let refundCnt =  0;
                    if(refundProsData && refundProsData.length){
                        let refundOpt = refundProsData.find(d=>{
                            return value.productId===d.productId
                        });
                        if(refundOpt){refundCnt = refundOpt.cnt}
                    }
                    //判断是否为赠菜
                    let freeProsCnt =  0;
                    if(freeProsData && freeProsData.length){
                        let freeProsOpt = freeProsData.find(d=>{
                            return value.productId===d.productId
                        });
                        if(freeProsOpt){freeProsCnt = freeProsOpt.cnt}
                    }
                    //过滤components
                    let components = value.components?this.getComponents({
                        refundProsData:refundProsData,
                        freeProsData:freeProsData,
                        components:value.components
                    }):null;

                    //判断是否有子商品，有则继续执行该函数
                    let subProducts = value.products;
                    if(subProducts){
                        subProducts = this.getProductList({
                            refundPros:refundProsData,
                            freePros:freeProsData,
                            products:subProducts
                        })
                    }
                    //获取套餐名称
                    let itemTypeData = this.getItemTypeText(value.itemType);
                    console.log("itemTypeData",itemTypeData);
                    return {
                        components: components,
                        productId:value.productId,  //商品ID
                        scaleName:value.scaleName||'',  //规格名称
                        productName:value.productName,  //名称
                        originalPrice: Number(value.originalPrice)?value.originalPrice:0,  //原价
                        paidFee:Number(value.paidFee)?value.paidFee:0,  //实际价
                        unitPrice:Number(value.unitPrice)?value.unitPrice:0,  //单价
                        cnt: value.cnt||0,  //份数
                        tips:value.tips||'',  //换购品
                        products:subProducts,  //下级商品
                        freeProsCnt: freeProsCnt,  //赠菜份数 0不是赠菜
                        refundCnt: refundCnt,  //退菜份数  0不是退菜
                        isExtra: !!value.isExtra,  //判断是否为附加费
                        isItemTypeText: itemTypeData.is,  //判断是否为套擦
                        itemTypeText: itemTypeData.text,  //套餐名称
                    }
                });
                return products
            },
            getItemTypeText:function(itemType){
                let data = {
                    is:false,
                    text:'未知',
                };
                switch (itemType) {
                    case 'zixuan':
                        data = {
                            is:true,
                            text:"自选"
                        };
                        break;
                    case 'taocan':
                        data = {
                            is:true,
                            text:"套餐"
                        };
                        break;
                    case 'product':
                        data = {
                            is:false,
                            text:"产品"
                        };
                        break;
                    default:

                        break;

                }
                return data
            },
            getExtraList:function (arr) {
                return arr.filter(d=>d.isExtra);
            },
            getShowItems:function (arr) {
                let list = arr.filter(d=>{
                    return  (d.cnt>0 && !d.isExtra)
                });
                return list
            },
        }
    };
</script>
<style lang="scss" scoped>
    .orderDetail{
        min-height: 100vh;
        /*overflow: hidden;*/
        background-color: #f4f4f4;
        .remind {
            height: 36px;
            padding-left: 20px;
            background-color: #FFE1D3;
            font-size: 14px;
            line-height: 36px;
            color: #E8552B;
        }
        .order-infos {
            min-height: 70px;
            background-color: #FFF;
            padding: 5px 0 10px 20px;
            color: #666;
            font-size: 14px;
            letter-spacing: 1px;
            span {
                flex: 1;
                color: #999;
            }
            div {
                display: -webkit-flex;
                display: flex;
                padding-top: 10px;
            }
            .store-name {
                font-size: 16px;
                color: #333;
                font-weight: bold;
            }
            .status.pending {
                color: #E8552B;
            }
            .status {
                text-align: right;
                padding-right: 30px;
            }
        }
        .sec-order-details.gray{
            li{
                color: #666;
            }
        }
        .sec-order-details{
            margin: 10px 0;
            background-color: #fff;
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
                .price{
                    float: right;
                    width: 40%;
                    text-align: right;
                    .del{
                        font-size: 12px;
                        color: #999;
                        text-decoration:line-through;
                    }
                }
                .copies{
                    float: right;
                    width: 30px;
                    span{
                        font-size: 12px;
                    }
                }
                .title{
                    overflow: hidden;
                    display: block;
                    padding-right: 8%;
                    .label{
                        color: #d0011b;
                        padding-right: 5px;
                    }
                    .remarks{
                        color: #999;
                    }
                }
            }
        }
        .sec-order-addition{
            padding: 5px 15px;
            background-color: #FFF;
            display: flex;
            display: -webkit-flex;
            min-height: 40px;
            color: #666;
            font-size: 14px;
            .item-lt {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                -webkit-flex: 1;
            }
            .item-rt {
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-width: 80px;
                text-align: right;
            }
        }
        .total-price{
            border-top: 1px solid #F5F5F5;
            margin-left: 20px;
            padding: 10px 20px 10px 0;
            text-align: right;
            line-height: 25px;
            span {
                font-size: 18px;
                font-weight: bold;
                color: #000;
                letter-spacing: -1px;
            }
        }
        .bar-footer-cum{
            .cum{
                height: 48px;
                display: block;
            }
            .bar-footer{
                height: 48px;
                line-height: 48px;
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                z-index: 9;
                background-color: #333;
                font-size: 14px;
                clear: both;
                overflow: hidden;
            }
            .price-info{
                padding-left: 10px;
                overflow: hidden;
                .name{
                    color: #fff;
                }
                .price{
                    color: #999;
                    margin-right: 5px;
                    font-size: 18px;
                }
                .del{
                    color: #999;
                    font-size: 14px;
                    text-decoration: line-through;
                }
            }
            .button-box{
                float: right;
                width: 7rem;
                overflow: hidden;
                text-align: center;
                background: linear-gradient(90deg, #FF8C57 0%, #E84E30 100%);
                font-weight: 700;
                color: #fff;
                font-size: 18px;
            }
        }
    }
</style>

