<template>
  <div class="plist">
    <div class="plist-wrap">
      <div class="plist-category-item">
        <i class="icon-hot"></i>
        <span>主厨推荐</span>
      </div>
      <div class="plist-category-item">
        <i class="icon-la"></i>
        <span>火辣辣</span>
      </div>
      <div class="plist-category-item">
        <i class="icon-new"></i>
        <span>新品尝鲜</span>
      </div>
      <div class="plist-category-item">
        <i class="icon-yh"></i>
        <span>促销</span>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "plist",
  components: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="sass">
::-webkit-scrollbar 
  display: none;
.plist
  width: 100%
  height: 4rem
  overflow: scroll
  .plist-wrap
    height: 100%
    min-width: 30rem
    margin-left: 5px
  .plist-category-item
    font-size: 14px;
    float: left
    overflow: hidden;
    position: relative;
    display: inline-block;
    min-width: 4.5rem;
    height: 3.125rem;
    margin: 0.5rem 10px 0 0;
    padding: 0 10px 0 5px;
    background: #FFFFFF;
    border: 1px solid #F2F2F2;
    box-shadow: 4px 4px 4px 0 #F2F2F2;
    border-radius: 4px;
    line-height: 3.125rem;
    i
      float: left;
      width: 2rem;
      height: 2rem;
      margin: 5px 5px 0 0;
      vertical-align: middle;
      background-repeat: no-repeat;
      background-image: url(../../assets/img/sh/theme/@2x/normal/category-tags.png);
      background-size: 2rem auto;
      position: relative 
      top: 0.2rem
    .icon-hot
      background-position: 0 0;
    .icon-la
      background-position: 0 -2rem;
    .icon-new
      background-position: 0 -4rem;
    .icon-yh
      background-position: 0 -6rem;

</style>

