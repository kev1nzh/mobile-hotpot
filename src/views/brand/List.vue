<template>
    <div class="BrandList">
        <div class="title">
            <h5>
                去哪里用餐<span class="close"></span>
            </h5>
        </div>
        <div class="list" v-if="list.length">
            <Scroll
                    :data="[]"
                    :isMore="false"
                    :pullUpLoad="false"
                    :pullDownRefresh="false"
            >
                <ul>
                    <li v-for="item in list" :key="item.id" @click="tap(item.id)">
                        <p class="name">{{item.name}}</p>
                        <p class="detail">{{item.address}}</p>
                    </li>
                </ul>
            </Scroll>

        </div>
    </div>
</template>
<script>
    import Scroll from '../../public_comp/Scroll'
    export default {
        name: "BrandList",
        components: {
            Scroll
        },
        data() {
            return {
                brand:{},
                list:[]
            }
        },
        mounted(){
            this.Service.IBrandService.GetBrandStores().then(d=>{
                this.brand = d.result.brand||{};
                this.list = d.result.data||[];
            })
        },
        methods: {
            tap:function (id) {
                console.log('brandId',id);
                let brandInfo = {
                    brandId:id,
                    ImplementsIBrand() {
                        return true;
                    }
                };
                localStorage['IbrandId'] = id;
                this.Framework.InitializationFramework({
                    brandInfo: brandInfo,
                });
                console.log("localStorage",localStorage);
                console.log("this.Framework",this.Framework)
            }
        }
    };
</script>
<style lang="scss" scoped>
    .BrandList{
        height: 100vh;
        overflow: hidden;
        display: block;
        position: relative;
        z-index: 1;
        color: #333;
        .title{
            padding: 0 5px;
            position: relative;
            z-index: 3;
            h5{
                font-weight: 500;
                color: #333;
                font-size: 17px;
                text-align: center;
                height: 40px;
                line-height: 40px;
                clear: both;
                overflow: hidden;
                text-indent: 32px;
            }
            .close{
                display: block;
                height: 100%;
                overflow: hidden;
                float: right;
                background: url("../../assets/img/sh/icon-close.png") 50% 50% no-repeat;
                background-size: 100% auto;
                width: 32px;
            }
        }
        .list{
            position: absolute;
            left: 0;
            right: 0;
            top: 44px;
            bottom: 0;
            z-index: 2;
            overflow: hidden;
            ul{
                padding: 0 16px;
                li{
                    padding: 20px 0 6px;
                    .name{
                        font-size: 22px;
                        font-weight: normal;
                    }
                    .detail{
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>

