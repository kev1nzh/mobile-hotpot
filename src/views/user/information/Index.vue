<template>
    <div class="information">
        <ul>
            <li @click="goUrl('/user/bindPhone')">
                <span class="label">手机</span>
                <span class="value">{{mobile}} <i class="icon">&gt;</i></span>
            </li>
            <li @click="goUrl('/user/update',{name:'sex'})">
                <span class="label">性别</span>
                <span class="value">{{sex}} <i class="icon">&gt;</i></span>
            </li>
            <li @click="goUrl('/user/update',{name:'birth'})">
                <span class="label">生日</span>
                <span class="value">{{birthday}} <i class="icon">&gt;</i></span>
            </li>
        </ul>
        <ul class="next" @click="goUrl('/user/update',{name:'password'})">
            <li>
                <span class="label">重置密码</span>
                <span class="value"><i class="icon">&gt;</i></span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Information",
        components: {

        },
        data(){
            return{
                birthday:'',
                sex:'',
                mobile:'',
            }
        },
        mounted() {
            this.getUserData();//用户数据
        },
        methods:{
            getUserData:function(){
                this.Service.IMemberService.GetMemberInfoByToken().then(d=>{
                    console.log("dddd",d);
                    this.mobile = d.mobile;
                    this.sex = d.sex;
                    this.birthday = d.birthday;
                })
            },

            goUrl(url,params){
                this.$router.push({
                    path:url,query:params
                })

            },
        }
    };
</script>
<style lang="scss" scoped>
    .information{
        background-color: #F4F4F4;
    }
    .next{
        li{
            color: #999;
        }
        margin-top: 20px;
        border-top: 1px solid #ddd;
    }
    li{
        padding: 16px;
        overflow: hidden;
        color: #3a3a3a;
        font-size: 16px;
        background-color: #fff;
        clear: both;
        line-height: 20px;
        border-bottom:1px solid #ddd;
        span{
            display: inline-block;
        }
        .value{
            float: right;
            color: #AAAAAA;
            display: inline-block;
            min-width: 10px;
            vertical-align: baseline;
            text-align: center;
            white-space: nowrap;
            font-weight: bold;
            font-size: 14px;
            i{
                margin-left: 8px;
            }
        }
    }
</style>

