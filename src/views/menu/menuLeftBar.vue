<template>
  <div class="menuLeftBar">
    <div class="menuLeftBar-wrap">
      <Scroll :data="[]" :is-more="false" :pullUpLoad="false" :pullDownRefresh="false" :probeType="3"  :getScrollObj="getScrollObj">
        <ul>
          <li v-for="(type,index) in types" :key="index"
              @click="switchTypes(index)"
              class="menuLeftBar-wrap-item"
              :for="type.id"
              ref="types"
          >
            <span>{{type.name}}</span>
          </li>
        </ul>
      </Scroll>
    </div>

  </div>
</template>

<script>
    // @ is an alias to /src
    import Scroll from "../../public_comp/Scroll"
    export default {
        name: "menuLeftBar",
        components: {
            Scroll
        },
        data() {
            return {
                typesArr: [],
                swIndex:0,
                heightArr:[]
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.computedHeight();
            });

        },
        // watch: {
        //     currItem(newV) {
        //         let idx = newV.idx;
        //         let dom = this.heightArr[idx].dom;
        //         this.scrollMain.scrollToElement(dom, 100, false, false);
        //     }
        // },
        methods: {
            getScrollObj:function(scroll){
                this.$emit('getData',{key:'scrollMainLeft',data:scroll})
            },
            switchTypes(idx) {
                let dom = this.scrollTypes[idx].dom;
                this.scrollMain.scrollToElement(dom, 0, false, false);
                this.$emit('getData',{key:'idx',data:idx});
            },
            computedHeight:function(){
                if(this.$refs.types) {
                    let heightArr = [];
                    if(Array.isArray(this.$refs.types)){
                        let offsetScroll = 0;
                        heightArr = this.$refs.types.map((d,k)=>{
                            let h = d.clientHeight|| d.offsetHeight;
                            h = parseInt(h);
                            offsetScroll = offsetScroll+h;
                            return {
                                h: h,
                                dom:d,
                                offsetScroll:offsetScroll,
                                idx:k
                            }
                        });
                    }else{
                        let h = this.$refs.types.clientHeight|| this.$refs.types.offsetHeight;
                        h = parseInt(h);
                        heightArr.push({
                            h: h,
                            dom: this.$refs.types,
                            offsetScroll:h,
                            idx: 0
                        })
                    };
                    this.$emit('getData',{key:'scrollTypesLeft',data:heightArr,})
                }
            }
        },
        props: {
            types: {
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
  .menuLeftBar
    width: 3.75rem;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    .menuLeftBar-wrap
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #F5F5F5;
      .menuLeftBar-wrap-item.act
        color: red;
      .menuLeftBar-wrap-item
        /*color: #999;*/
        border-bottom: 1px solid #E9E9E9;
        width: 3.75rem;
        min-height: 2.75rem;
        display: flex;
        align-items: center;
        padding: 0 0.4rem;
        text-align: center;
        align-items: center;
        box-sizing: border-box;
        color: #333;
        span
          flex: 1;
          font-size: 0.7rem;
          text-align: center;
      /*color: #333;*/
      .menuLeftBar-wrap-item-switch
        color: #999;
        border-bottom: 1px solid #E9E9E9;
        width: 3.75rem;
        min-height: 2.75rem;
        display: flex;
        align-items: center;
        padding: 0 0.4rem;
        text-align: center;
        align-items: center;
        box-sizing: border-box;
        background: white;
        span
          flex: 1;
          font-size: 0.7rem;
          text-align: center;
          color: #333;
</style>

