import Index from '../views/index'
import ProductDetail from '../views/menu/productDetail'
export default [
    {
        path: '/menu',
        name: 'menu',
        component: Index
    },
    {
        path: '/menu/product/detail',
        name: 'productDetail',
        component: ProductDetail
    }
]