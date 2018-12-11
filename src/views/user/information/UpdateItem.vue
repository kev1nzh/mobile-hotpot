<template>
    <div class="userUpdateItem">
        <!--更新性别-->
        <div class="sexItem item" v-if="name==='sex'">
            <ul>
                <li @click="sex='男'">
                    <span class="label">男</span>
                    <span class="value">
                        <i :class="'icon '+ (sex=='男'?'active':'')"></i>
                    </span>
                </li>
                <li @click="sex='女'">
                    <span class="label">女</span>
                    <span class="value">
                        <i :class="'icon '+ (sex=='女'?'active':'')"></i>
                    </span>
                </li>
            </ul>
        </div>

        <!--生日-->
        <div class="birthItem item" v-if="name==='birth'">
            <ul>
                <li @click="openBirthPicker">
                    <span class="label">生日</span>
                    <span class="value">{{birth?moment(birth).format("YYYY-MM-DD"):''}}</span>
                </li>
            </ul>
            <mt-datetime-picker
                    v-model="birth"
                    ref="birthPicker"
                    type="date"
                    :startDate="date.startDate"
                    :endDate="date.endDate"
                    minuteFormat="YYYY-MM-DD"
                    year-format="{value}年"
                    month-format="{value}月"
                    date-format="{value}日"
                    @confirm="birthConfirm"
            >
            </mt-datetime-picker>
        </div>
        <!--重置密码-->
        <div class="passwordItem item" v-if="name==='password'">
            <div class="input">
                <input type="password" placeholder="输入6位数字密码" maxlength="6" v-model="password.value"/>
            </div>
            <div class="input">
                <input type="password" placeholder="再次输入密码" maxlength="6" v-model="password.againValue"/>
            </div>
        </div>
        <!--提交按钮-->
        <div class="button-bar" v-if="name">
            <a href="javascript:" @click="updateDate">提交</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserUpdateItem",
        components: {

        },
        mounted() {
            this.getUserData();
        },
        data(){
            return{
                name: this.$route.query.name||"sex",
                birth:'',
                mobile:'',
                sex:'',
                date:{
                    startDate: new Date(-946800000000), //1940年开始
                    endDate:new Date(),
                },
                password:{
                    value:'',
                    againValue:''
                }
            }
        },
        methods:{
            getUserData:function(){
                this.Service.IMemberService.GetMemberInfoByToken().then(d=>{
                    console.log("dddd",d);
                    this.mobile = d.mobile;
                    this.sex = d.sex;
                    this.birth = d.birthday;
                })
            },
            openBirthPicker() {
                this.$refs.birthPicker.open();
            },
            birthConfirm(v){
                console.log("vvv",v);
            },
            updateDate:function(){
                let tPromise = null;
                if(this.name==='birth'){
                    tPromise = this.updateBirthday();
                }else if(this.name==='sex'){
                    tPromise = this.updateSex();
                }else if(this.name==='password'){
                    tPromise = this.updatePassword();
                }
                if(tPromise){
                    tPromise.then(d=>{
                        console.log(d);
                        if(d.count===1){
                            this.toast('更新成功');
                            setTimeout(()=>{
                                history.back();
                               // this.goUrl('/user/information');
                            },2000);
                        }
                    })
                }

            },
            updateBirthday:function(){
                if(!this.birth){
                    this.toast('请选择出生日期');
                }
                return this.Service.IMemberService.UpDateBirthday({birthday:this.moment(this.birth).format("YYYY-MM-DD")})
            },
            updatePassword:function(){
                const reg =new RegExp("^[0-9]{6}$");
                if(!reg.test(this.password.value)){
                    this.toast('请输入6位数密码');
                    return false
                }else if(this.password.value!==this.password.againValue){
                    this.toast('两次密码不一致');
                    return false
                }else{
                    return this.Service.IMemberService.ResetPassword({pwd:this.password.value});
                }
            },
            updateSex:function(){
                if(!this.sex){
                    this.toast('请选择性别');
                }
                return this.Service.IMemberService.UpdateSex({sex:this.sex})
            },
            goUrl(url,params){
                this.$router.push({
                    path: url
                })
            },
        }
    };
</script>
<style lang="scss" scoped>
    .userUpdateItem{
        background-color: #F4F4F4;
    }
    .item{
        margin-top: 20px;
    }
    .input{
        padding: 8px 24px 6px 16px;
        margin: 0 10px 20px;
        background-color: #fff;
        border:1px solid rgb(221, 221, 221);
        input{
            height: 34px;
            color: #111;
            font-size: 14px;
            border: none;
            display: block;
            width: 100%;
        }
    }
    ul{
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
            i{
                display: inline-block;
                padding: 6px;
                border-radius: 50%;
            }
            i.active{
                background-color: #ffc900;
            }
        }
    }
    .button-bar{
        padding: 20px 10px;
        a{
            display: block;
            height: 44px;
            text-align: center;
            line-height: 44px;
            background-color: red;
            color: #333;
            font-size: 16px;
        }
    }
</style>

