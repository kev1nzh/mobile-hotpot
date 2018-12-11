// 这个store是用来承载口味的窗口的
export default {
    state: {
        product: {
            base: {
                name: '',
                components: [],
                scales: [],
            }
        },
        isShow: false,
        selfHelp_isShow: false,
        person_isShow: true,
        coupon_isShow: false,
        pay_isShow: false,
        payData: {
            orderType: '',
            zongjia: 0,
            nono: '',
            ordersId: '',
            cb: '',
        }
    },
    mutations: {
        switchType(state) {
            state.isShow = !state.isShow;
        },
    }
}
