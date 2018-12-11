export default {
    state: {
        ShopCartCache: [],
        orderId: '',
        no: '',
        orderInfo: {},
        discount: {},
    },
    mutations: {
        saveOrderInfo(state, orderInfo) {
            state.orderInfo = orderInfo;
            console.log(state);
        },
        saveOrderDiscount(state, discount) {
            state.discount = discount;
            console.log(state);
        },
    }
}