<template>
    <div class="bindPhone">
        <div class="inputNormal">
            <input type="phone" placeholder="请输入您的手机号" maxlength="11" class="input-noraml" />
        </div>
        <div class="inputClick login-button">
            <div class="input-click">绑定新手机号</div>
        </div>
    </div>
</template>
<script>

    export default {
        name: "bindPhone",
        components: {
        },
        data() {
            return {
                phone_number: '17602180307',
                password: '963700',
                showPassword: false
            }
        },
        methods: {
        }
    };
</script>
<style lang="scss" scoped>
    .bindPhone{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        margin-top: -1px;
        padding-top: 1px;
        margin-bottom: -1px;
        width: auto;
        height: auto;
        background: url("../../assets/img/sh/theme/@2x/member-center/register-bg.png");
        .inputNormal{
            width: 90%;
            margin: 1rem;
            margin-top: 5rem;
            .input-noraml{
                width: 100%;
                height: 2.5rem;
                line-height: 2.5rem;
                border-bottom: 1px solid #E9E9E9;
                font-size: 20px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                padding-left: 0.75rem;
                color: #4a4a4a;
                font-weight: normal;
                outline-offset: 0;
                outline-style: none;
                outline-width: 0;
                -webkit-font-smoothing: inherit;
                background-image: none;
            }
        }
        .login-button{
            margin-top: 5rem;
        }
        .inputClick{
            width: 90%;
            margin: 1rem;
            margin-top: 5rem;
            .input-click{
                background: #E3C48A;
                width: 100%;
                height: 2.5rem;
                line-height: 2.5rem;
                border-bottom: 1px solid #E9E9E9;
                font-size: 16px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                text-align: center;
                color: #8C6500;
                font-weight: normal;
                outline-offset: 0;
                outline-style: none;
                outline-width: 0;
                -webkit-font-smoothing: inherit;
                background-image: none;
            }
        }
    }
</style>

