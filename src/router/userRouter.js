import CouponList from '../views/user/couponList/couponList'
import User from '../views/user/user'
import UserLevel from '../views/user/level/Index'
import Login from '../views/user/login'
import BindPhone from '../views/user/BindPhone'
import Integral from '../views/user/integral/Index'
import Order from '../views/user/order/Index'
import OrderDetail from '../views/user/order/Detail'
import Balance from '../views/user/balance/Index'
import BalanceHistory from '../views/user/balance/History'
import Information from '../views/user/information/Index'
import UserUpdateItem from '../views/user/information/UpdateItem'

export default [
    {
        path: '/user',
        name: 'user',
        component: User,
    },
    {
        path: '/user/login',
        name: 'user',
        component: Login,
    },
    {
        path: '/user/couponList',
        name: 'couponList',
        component: CouponList,
    },
    {
        path: '/user/level',
        name: 'level',
        component: UserLevel,
    },
    {
        path: '/user/integral',
        name: 'integral',
        component: Integral,
    },
    {
        path: '/user/order',
        name: 'order',
        component: Order,
    },
    {
        path: '/user/balance',
        name: 'balance',
        component: Balance,
    },
    {
        path: '/user/balanceHistory',
        name: 'balanceHistory',
        component: BalanceHistory,
    },
    {
        path: '/user/orderDetail',
        name: 'orderDetail',
        component: OrderDetail,
    },
    {
        path: '/user/information',
        name: 'information',
        component: Information,
    },
    {
        path: '/user/update',
        name: 'userUpdateItem',
        component: UserUpdateItem,
    },
    {
        path: '/user/bindPhone',
        name: 'bindPhone',
        component: BindPhone,
    },
]