<template>
    <div class="history">
        <Scroll
                v-if="list.length"
                :data="list"
                :isMore="isMore"
                @pullingUp="pullingUp"
                @pullingDown="pullingDown"
        >
            <ul>
                <li v-for="item in list" :key="item.ordersId">
                    <div class="title">
                        <p class="price">{{item.fee}}</p>
                        <h5>{{item.operation}}</h5>
                    </div>
                    <p class="date">{{moment(item.addTime).format("YYYY-MM-DD hh:mm")}}</p>
                </li>
            </ul>
        </Scroll>
        <div v-else class="notData">
            暂无信息
        </div>
    </div>
</template>

<script>
    import Scroll from '../../../public_comp/Scroll'
    export default {
        name: "History",
        components: {
            Scroll
        },
        data(){
            return{
                list:[],
                isMore:true,
                page:1,
            }
        },
        mounted() {
            this.init();
        },
        methods:{
            init:function(){
                Promise.all([
                    this.getAccountLog(1),
                    this.getAccountLog(2),
                    this.getAccountLog(3),
                ]).then(res=>{
                    let res1 = res[0];
                    let res2 = res[1];
                    let res3 = res[2];
                    if(res3.length<10){
                        this.isMore = false;
                    }else{
                        this.isMore = true;
                    }
                    this.page = 3;
                    this.list = [].concat(res1,res2,res3);
                    // if(res)this.list=res;
                });
            },
            pullingUp:function () {
                console.log("pullingUp");
                this.page = this.page+1;
                this.getAccountLog().then(res=>{
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
            getAccountLog:function (page) {
                return this.Service.IMemberService.GetAccountLogList({
                    page: page||this.page,
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
   .history{
       height: 100vh;
       overflow: hidden;
       ul{
           background-color: #fff;
       }
        li{
            padding: 16px 16px 0;
        }
       .title{
           clear: both;
           overflow: hidden;
           .price{
               float: right;
               font-size: 18px;
               color: #333;
           }
           h5{
               overflow: hidden;
               font-weight: 500;
               font-size: 15px;
               color: #999;
           }
       }
       .date{
           color: #9b9b9b;
           width: 100%;
           font-size: 12px;
           line-height: 20px;
       }
   }
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
</style>

