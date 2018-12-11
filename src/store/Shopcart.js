export default {
    state: {
        Shopcart: [],
    },
    mutations: {
        addProduct(state, product) {
            state.Shopcart.push(product);
        },
    }
}