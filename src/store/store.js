import Vue from 'vue'
import Vuex from 'vuex'
import Cloud from './Cloud'
import Shopcart from './Shopcart'
import  Kind from './Kind'
import OrderInfo from './OrderInfo'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: ({
    Cloud,
    Shopcart,
    Kind,
    OrderInfo,
  })
})
