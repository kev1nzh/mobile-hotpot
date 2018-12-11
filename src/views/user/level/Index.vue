<template>
    <div class="UserLevel">
        <div class="my-grade">
            <h3 class="ng-binding">白金</h3>
        </div>
        <div class="grades">
            <div class="grade" v-for="(item,index) in grades" @click="actIndex=index">
                <label :class="'binding '+ (currIndex===index?'current-grade ':'') +(actIndex===index?'active ':'')">V{{item.level}}</label>
                <em class="line" v-if="index!==(grades.length-1)"></em>
                <i class="up-arw" v-show="actIndex===index"></i>
            </div>
        </div>
        <div class="grade-detail" v-if="grades[actIndex]">
            <h4>会员权益<label class="ng-binding">({{grades[actIndex].name}})</label></h4>
            <div>
                <p v-if="grades[actIndex].discount===10">不打折</p>
                <p v-else>{{grades[actIndex].name}}可享部分商品{{grades[actIndex].discount}}折会员价</p>
                <p>每消费{{grades[actIndex].integralMoney}}元可获得{{grades[actIndex].integralCnt}}积分</p>
                <p v-if="grades[actIndex+1]">成长到V{{grades[actIndex+1].level}}需要达到 {{grades[actIndex+1].levelCnt}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "UserLevel",
        components: {},
        data() {
            return {
                actIndex:0,
                currIndex: 0,
                grades:[],
                userData:{}
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init:function () {
                Promise.all(
                    [
                        this.Service.IMemberService.GetMemberInfoByToken(), //获取用户数据
                        this.Service.IBrandService.GetBrandGrades(),  //获取粉丝等级
                    ]
                ).then(res=>{
                    let userData = res[0];
                    let grades = res[1].data;
                    let gradeId = parseInt(userData.gradeId);
                    grades = grades.filter(d=>{
                        return d.id !==1054;
                    });
                    let index = grades.findIndex(d=>{
                        return gradeId===d.id
                    });
                    index = index===-1?0:index;
                    this.userData = userData;
                    this.grades = grades;
                    this.currIndex = index;
                    this.actIndex = index;


                    console.log(userData);
                    console.log(grades);
                })
            }
        }
    };
</script>
<style lang="scss" scoped>
   .UserLevel{
       position: absolute;
       left: 0;
       right: 0;
       top: 0;
       bottom: 0;
       z-index: 3;
       background: #3D3D3D;
       .my-grade {
           height: 105px;
           background: url(../../../assets/img/sh/theme/@2x/normal/crown.png) no-repeat 20px 20px;
           background-size: 65px auto;
           h3 {
               padding: 35px 0 0 102px;
               font-size: 18px;
               color: #E3C48A;
           }
       }
       .grades {
           padding: 0 8px;
           .grade {
               position: relative;
               z-index: 1;
               .up-arw {
                   left: 8px;
                   position: absolute;
                   bottom: -14px;
                   width: 8px;
                   height: 8px;
                   transform: scaleX(1.5);
                   -webkit-transform: scaleX(1.5);
               }
               .up-arw:before {
                   content: '';
                   display: block;
                   width: 8px;
                   height: 8px;
                   border-top: 1px solid #E3C48A;
                   border-left: 1px solid #E3C48A;
                   background-color: #3D3D3D;
                   transform: rotate(45deg);
               }
               display: inline-block;
               label {
                   vertical-align: middle;
                   color: #7C7C7C;
                   font-size: 16px;
                   font-style: italic;
                   font-weight: bold;
                   cursor: pointer;
               }
               label.active {
                   display: inline-block;
                   transform: scale(1.25);
                   -webkit-transform: scale(1.25);
                   -webkit-transition: transform .1s linear;
                   -o-transition: transform .1s linear;
                   transition: transform .1s linear;
               }
               label.current-grade {
                   color: #E9C872;
               }
               .line {
                   display: inline-block;
                   width: 37px;
                   height: 4px;
                   margin: 0 3px;
                   background-color: #494949;
                   vertical-align: middle;
               }
           }
       }
       .grade-detail {
           position: relative;
           margin: 10px 9px 0;
           padding: 0 20px;
           border: 1px solid #E3C48A;
           h4 {
               font-size: 16px;
               color: #E3C48A;
               margin-top: 10px;
               margin-bottom: 10px;
               font-weight: normal;
           }
           p {
               color: #999;
               margin: 0 0 10px;
               font-size: 14px;
           }
       }
   }
</style>

