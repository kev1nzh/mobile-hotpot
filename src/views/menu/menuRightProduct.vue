<template>
  <div class="menuRightProduct">
    <div class="menuRightProduct-wrap">
      <Scroll :data="[]" :is-more="false" :pullUpLoad="false" :pullDownRefresh="false" :probeType="3" :myScroll="scroll" :getScrollObj="getScrollObj">
        <div class="menuRightProduct-wrap-item" v-for="(type,index) in productData"
             :key="index"
             ref="computedHeight">
          <h3  class="menuRightProduct-wrap-title">{{type.name}}</h3>
          <product v-for="product in type.products" :num="shopCart.products.filter(e => e.id == product.id)" :key="product.id" :product="product" />
        </div>
      </Scroll>
    </div>

  </div>
</template>

<script>
    // @ is an alias to /src
    import product from "./product";
    import Scroll from "../../public_comp/Scroll"

    export default {
        name: "menuRightProduct",
        components: {
            product,
            Scroll,
        },
        data() {
            return {
                heightArr:[],
                shopCart: {
                    products: []
                }
            };
        },
        mounted() {
            this.$nextTick(()=>{
                this.computedHeight();
                this.getShopcart();
            });
            
        },
        methods: {
            getShopcart() {
                let shopCart = this.Service.IShoppingCartService.GetShoppingCartInfo();
                if (!shopCart.products) {
                    shopCart.products = [];
                }
                this.shopCart = Object.assign({}, this.shopCart, shopCart);
            },
            getScrollObj:function(scroll){
                this.$emit('getData',{key:'scrollMainRight',data:scroll})
            },
            computedHeight:function(){
                //计算高度
                if(this.$refs.computedHeight){
                    let heightArr = [];
                    if(Array.isArray(this.$refs.computedHeight)){
                        let offsetScroll = 0;
                        heightArr = this.$refs.computedHeight.map((d,k)=>{
                            let h = d.clientHeight|| d.offsetHeight;
                            h = parseInt(h);
                            offsetScroll = offsetScroll+h;
                            return {
                                h: h,
                                offsetScroll:offsetScroll,
                                dom:d,
                                idx:k
                            }
                        })
                    }else{
                        let h = this.$refs.computedHeight.clientHeight|| this.$refs.computedHeight.offsetHeight;
                        h = parseInt(h);
                        heightArr.push({
                            h: h,
                            dom:this.$refs.computedHeight,
                            offsetScroll:h,
                            idx: 0
                        })
                    }
                    this.heightArr = heightArr;
                    this.$emit('getData',{key:'scrollTypesRight',data:heightArr});
                }
            },
            scroll:function(o){
                let y = -parseInt(o.y);
                let heightArr = this.heightArr;
                let currModel = {};
                if(y<heightArr[0].offsetScroll){
                    currModel = heightArr[0]
                }else if(y>heightArr[heightArr.length-1].offsetScroll){
                    currModel = heightArr[heightArr.length-1];
                }else{
                    for(let idx = 0;idx<heightArr.length;idx++){
                        let item = heightArr[idx];
                        let nextItem = heightArr[idx+1]||{};
                        let preItem = heightArr[idx-1]||{};
                        let preOffsetScroll = preItem.offsetScroll||0;
                        let nextOffsetScroll = nextItem.offsetScroll||0;
                        if(y>=item.offsetScroll && y<nextOffsetScroll){
                            currModel = nextItem;
                        }
                    }
                }
                let domLeft = this.scrollTypes[currModel.idx].dom;
                this.scrollMain.scrollToElement(domLeft, 100, false, true);
                // this.$emit('getData',{key:'timer',data:100});
                this.$emit('getData',{key:'idx',data:currModel.idx});
            },
        },
        props: {
            productData: {
                type: Array
            },
            scrollMain:{
                type: Object
            },
            scrollTypes:{
                type: Array
            },
            idx:{
                type: Number
            },
        }
    };
</script>
<style lang="sass">
  .menuRightProduct
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    position: absolute;
    left: 3.75rem;
    right: 0;
    top: 0;
    bottom: 0;
    margin-top: -1px;
    border-top: 1px solid #F6F6F6;
    .menuRightProduct-wrap
      width: 100%
      height: 100%;
      position: absolute
      left: 0
      top: 0
      padding-left: 0.4rem;
      /*box-sizing: border-box;*/
      /*padding-bottom: 100px;*/
      .menuRightProduct-wrap-item
        .menuRightProduct-wrap-title
          position: relative
          padding: 13px 0 0 0
          font-size: 14px
          color: #999999
          z-index: 9
          background-color: #FFF
          border-bottom: 1px solid #fff
          margin-bottom: 10px
          &:after
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            margin-top: 7px;
            background-color: #F5F5F5;
</style>

