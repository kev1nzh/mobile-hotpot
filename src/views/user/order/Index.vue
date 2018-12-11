<template>
    <div class="order">
        <Scroll
                v-if="list.length"
                :data="list"
                :isMore="isMore"
                @pullingUp="pullingUp"
                @pullingDown="pullingDown"
        >
            <ul>
                <li @click="goUrl('/user/orderDetail',{orderId:item.orderId})" v-for="(item,index) in list" :key="item.orderId+item.realOrderId">
                    <div class="header">
                        <p class="price">￥{{item.price}}</p>
                        <div class="title">
                            <h5>{{item.title}}</h5>
                            <p class="date">{{item.date}}</p>
                        </div>
                    </div>
                    <p class="msg first">
                        <span class="label">{{item.summary}}</span><span class="value">等{{item.fenshu}}份</span>
                    </p>
                    <p class="msg">
                        <span class="label">桌号：</span><span class="value">{{item.deskId}}</span>
                    </p>
                    <div class="status">
                        <span>{{item.statusT}}</span>
                    </div>
                </li>
            </ul>
        </Scroll>
        <div v-else class="notData">
            暂无订单
        </div>
    </div>
</template>

<script>
    import Scroll from '../../../public_comp/Scroll'
    export default {
        name: "order",
        components: {
            Scroll
        },
        data(){
            return{
                memberId: null,
                key:'SysMember',
                list:[],
                isMore:true,
                page:{
                    index:0,
                    size:10
                }
            }
        },
        mounted() {
            this.init();
        },
        methods:{
            pullingUp:function () {
                console.log("pullingUp");
                this.page.index = this.page.index+1;
                this.getOrder().then(res=>{
                    this.list = res.concat(this.list);
                    if(res.length<10){
                        this.isMore = false;
                    }
                });
            },
            pullingDown:function () {
                this.page.index = 0;
                this.getOrder().then(res=>{
                    this.isMore = true;
                    this.list = res;
                })
            },
            init:function () {
                let cache = this.Cache.GetCache({key: this.key});
                this.memberId = cache.memberId;
                this.getOrder().then(res=>{
                    this.list = res;
                    if(res.length<10){
                        this.isMore = false;
                    }
                })
            },
            getOrder:function () {
                return this.Service.IOrderService.GetMemberOrders({
                    pageIndex: this.page.index,
                    pageSize:this.page.size,
                    memberId:this.memberId
                });
            },
            goUrl(url,params){
                this.$router.push({
                    path: url,
                    query:params
                })
            },
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
    .order{
        height: 100vh;
        background-color: #f4f4f4;
        position: relative;
        z-index: 1;
        overflow: hidden;
      /*  .topText{
            top: 0;
        }
        .bottomText{
            bottom: 0;
        }
        .scrollText{
            position: absolute;
            left: 0;
            width: 100%;
            display: block;
            text-align: center;
            font-weight: 600;
            color: #333;
            z-index: 2;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
        }*/
    }
    ul{
        position: relative;
        z-index: 3;
    }
    li{
        border-bottom: 10px solid #f4f4f4;
        padding: 8px 10px 0 20px;
        background-color: #fff;
    }
    .header{
        clear: both;
        overflow: hidden;
        .price{
            float: right;
            overflow: hidden;
            line-height: 40px;
            font-size: 12px;
            color: #3a3a3a;
        }
        .title{
            overflow: hidden;
            .date,h5{
                line-height: 20px;
                overflow: hidden;
            }
            h5{
                font-size: 14px;
                font-weight: bold;
            }
            .date{
                font-size: 12px;
                color: #999;
            }
        }
    }
    .msg.first{
        padding-top: 10px;
        padding-bottom: 0;
    }
    .msg{
        padding-bottom: 10px;
        font-size: 12px;
        .label{
            color: #999;
        }
        .value{
            color: #333;
        }
    }
    .status{
        line-height: 32px;
        border-top: 1px solid #F5F5F5;
        text-align: right;
        font-size: 14px;
        color: #3a3a3a;
    }
</style>

