<template>
  <div class="index">
    <user-box />
    <shopcart />
    <menuList />

    <!-- 下面的组件是全局的 -->
    <special-type v-if="$store.state.Kind.isShow" />
    <self-help-type v-if="$store.state.Kind.selfHelp_isShow" />
    <person v-if="$store.state.Kind.person_isShow" />
    
  </div>
</template>

<script>
import specialType from './menu/specialType'
import selfHelpType from './menu/selfHelpType'
import person from './menu/person'
import userBox from './user/user-box'
import shopcart from './shopcart/shopcart'
import menuList from './menu/menuList'

export default {
  name: "index",
  components: {
    userBox,
    shopcart,
    menuList,
    specialType,
    selfHelpType,
    person,
  }
};
</script>
<style lang="sass">
  
</style>

