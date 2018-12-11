import Vue from 'vue'
import Router from 'vue-router'
import Init from '../views/init'
import Jump from '../views/jump'

import login from './loginRouter'
import user from './userRouter'
import menu from './menuRouter'
import activity from './activity'
import order from './orderRouter'
import brand from './brandRouter'





Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      name: 'initHtml',
      path: '/r.html',
      component: Init
    },
    {
      name: 'jump',
      path: '/jump',
      component: Jump
    },
    ...login,
    ...user,
    ...menu,
    ...activity,
    ...order,
    ...brand,
  ]
})