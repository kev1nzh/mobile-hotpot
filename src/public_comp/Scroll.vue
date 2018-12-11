<template>
    <div ref="wrapper" class="wrapper">
        <div class="content">
            <slot class="content"></slot>
        </div>
        <div class="textScroll top" v-if="pullDownRefresh && data.length">松手刷新列表</div>
        <div class="textScroll bottom" v-if="pullUpLoad">{{isMore?pullUpLoad.moreTxt:pullUpLoad.noMoreTxt}}</div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name:'Scroll',
        props: {
            /*必传*/
            //加载更多开启时，判断是否有更多数据
            isMore:{
                type: Boolean,
                required: true
            },
            //检测列表数据
            data: {
                type: Array,
                required: true
            },

            /*可选*/
            /*
            * 可选值：1、2、3
                作用：有时候我们需要知道滚动的位置。
                当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
                当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
                当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
            * */
            probeType:{
                type: Number,
                default: 0
            },
            //派发click事件
            click: {
                type: Boolean,
                default: true
            },
            //上拉加载
            pullUpLoad:{
                type: [Object,Boolean],
                default: function () {
                    return {
                        threshold: -30,  //超出的距离
                        moreTxt: '加载更多',
                        noMoreTxt: '没有更多数据了',
                    }
                },
            },
            //下拉刷新
            pullDownRefresh: {
                type: [Object,Boolean],
                default: function () {
                    return {
                        threshold: 30, //超出的距离
                        stop: 0  //刷新中停留的位置
                    }
                },
            },
            //数据变化后反应事件
            refreshDelay:{
                type: Number,
                default: 100
            },
            //myScroll
            myScroll:{
                type: Function,
            },
            myScrollEnd:{
                type: Function,
            },
            getScrollObj:{
                type: Function,
            }
        },
        data:function () {
            return{
                isLock:true,
            }
        },
        mounted() {
            // 保证在DOM渲染完毕后初始化better-scroll
            setTimeout(() => {
                this._initScroll()
            }, 20)
        },
        methods: {
            _initScroll() {
                if (!this.$refs.wrapper) {
                    return
                }
                // better-scroll的初始化
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    pullUpLoad: this.pullUpLoad,
                    pullDownRefresh: this.pullDownRefresh,
                });
                window.aa1 = this.scroll;

                /*绑定上拉加载*/
                if(this.pullUpLoad){
                    this.scroll.on('pullingUp', () => {
                        if(!this.isMore || !this.isLock){
                            return false;
                        }
                        this.$emit('pullingUp')
                    });
                }
                /*绑定下拉刷新*/
                if(this.pullDownRefresh){
                    this.scroll.on('pullingDown', () => {
                        if(!this.isLock){
                            return false;
                        }
                        this.$emit('pullingDown');
                    });
                }
                //绑定滚动
                if(this.myScroll){
                    this.scroll.on('scroll', (o) => {
                        this.myScroll(o);
                    });
                }
                if(this.myScrollEnd){
                    this.scroll.on('scrollEnd', (o) => {
                        this.myScrollEnd(o);
                    });
                }
                if(this.getScrollObj){
                    this.getScrollObj(this.scroll);
                }
            },
            disable() {
                // 代理better-scroll的disable方法
                this.scroll && this.scroll.disable()
            },
            enable() {
                // 代理better-scroll的enable方法
                this.scroll && this.scroll.enable()
            },
            refresh() {
                // 代理better-scroll的refresh方法
                this.scroll && this.scroll.refresh()
            },
            finishPullUp() {
                // 代理better-scroll的refresh方法
                this.scroll && this.scroll.finishPullUp()
            },
            finishPullDown() {
                // 代理better-scroll的refresh方法
                this.scroll && this.scroll.finishPullDown()
            },
            scrollTo() {
                // 代理better-scroll的scrollTo方法
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
            },
            scrollToElement() {
                // 代理better-scroll的scrollToElement方法
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            }
        },
        watch: {
            // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
            data() {
                this.isLock = false;
                setTimeout(() => {
                    this.refresh();
                    this.finishPullUp();
                    this.finishPullDown();
                    this.isLock = true;
                }, this.refreshDelay)
            },
        }
    }
</script>
<style lang="scss" scoped>
    .wrapper{
        height: 100%;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }
    .content{
        height: auto;
        clear: both;
        overflow: hidden;
        position: relative;
        z-index: 2;
    }
    .textScroll{
        position: absolute;
        left: 0;
        z-index: 1;
        height: 32px;
        line-height: 32px;
        text-align: center;
        width: 100%;
        font-size: 14px;
        font-weight: 600;
    }
    .top{
        top: 0;
    }
    .bottom{
        bottom: 0;
    }
</style>