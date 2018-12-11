import PayCoupon from '../views/activity/PayCoupon'
import PayCouponSuccess from '../views/activity/PaySuccess'
export default [
    {
        path: '/activity/coupon',
        name: 'payCoupon',
        component: PayCoupon
    },
    {
        path: '/activity/coupon/success',
        name: 'payCoupon',
        component: PayCouponSuccess
    },
]