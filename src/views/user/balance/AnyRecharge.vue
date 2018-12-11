<template>
    <div class="anyRecharge">
        <div class="field">
            <label class="field-name">金额</label>
            <div class="field-value" >
                <input type="phone" placeholder="输入充值金额" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AnyRecharge",
        components: {},
        data(){
            return{
                isShow:false
            }
        },
        methods:{

        }
    };
</script>
<style lang="scss" scoped>


    .field{
        clear: both;
        overflow: hidden;
        margin: 20px 15px 0;
        padding-left: 7px;
        border: 1px solid #DAD8D8;
        border-radius: 4px;
        .field-name:before{
            content: '*';
            display: inline-block;
            color: #FB8A56;
            font-size: 16px;
            vertical-align: middle;
            margin-top: 2px;
            margin-right: 5px;
        }
        .field-name{
            float: left;
            height: 50px;
            width: 87px;
            font-size: 16px;
            display: block;
            line-height: 50px;
        }
        .field-value{
            overflow: hidden;
            display: block;
            padding: 8px 0;
            input{
                border: none;
                height: 34px;
                width: 100%;
                display: block;
                font-size: 14px;
            }
        }
    }
</style>

