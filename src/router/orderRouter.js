import orderDetail from '../views/order/OrderDetail'
import Preorder from '../views/order/preorder'

export default [
    {
        path: '/order/preorder',
        name: 'preorder',
        component: Preorder
    },
    {
        path: '/order/order_detail',
        name: 'OrderDetail',
        component: orderDetail,
    }
]