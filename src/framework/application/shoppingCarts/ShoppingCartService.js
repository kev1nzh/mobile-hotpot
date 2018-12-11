import { BaseApplicationService } from "../BaseApplicationService";
import { ShoppingCartDto } from "./dtos/ShoppingCartDto";
import { GetCacheInput } from "../../core/cache/dtos/GetCacheInput";
import { AddCacheDto } from "../../core/cache/dtos/AddCacheDto";
import { Common } from "../../core/common/Common";
export class ShoppingCartService extends BaseApplicationService {
    constructor() {
        super();
        this._shoppingCartCacheKey = "ShoppingCart";
    }
    GetShoppingCartCache() {
        return this.Cache.GetCache(new GetCacheInput(this._shoppingCartCacheKey));
    }
    InitShoppingCart(data) {
        let shoppingCart = this.GetShoppingCartCache();
        if (!shoppingCart) {
            let shopCart = new ShoppingCartDto({ deskId: data.deskId, deskName: data.deskName, memberId: data.memberId, person: data.person, orderId: data.orderId });
            this.Cache.AddCache(new AddCacheDto(this._shoppingCartCacheKey, shopCart, 0));
        }
        else {
            let shopCart = new ShoppingCartDto({ deskId: data.deskId, deskName: data.deskName, memberId: data.memberId, person: data.person, orderId: data.orderId });
            this.Cache.UpdateCache({ key: this._shoppingCartCacheKey, data: shopCart });
        }
        return true;
    }
    AddProduct(product) {
        let shoppingCart = this.GetShoppingCartCache();
        if (shoppingCart) {
            let oldPros = shoppingCart.products.filter((p) => p.id == product.id && p.scaleId == product.scaleId);
            if (oldPros && oldPros.length > 0) {
                let matchComponents = false;
                for (let index = 0; index < oldPros.length; index++) {
                    const oldPro = oldPros[index];
                    if (product.components) {
                        let newCompKey = "";
                        for (let index = 0; index < product.components.length; index++) {
                            const newProComp = product.components[index];
                            newCompKey += "C" + newProComp.id;
                            for (let index = 0; index < newProComp.items.length; index++) {
                                const newProCompItem = newProComp.items[index];
                                newCompKey += ("_I" + newProCompItem.id + "_C" + newProCompItem.count);
                            }
                        }
                        let oldCompKey = "";
                        for (let index = 0; index < oldPro.components.length; index++) {
                            const oldProComp = oldPro.components[index];
                            oldCompKey += "C" + oldProComp.id;
                            for (let index = 0; index < oldProComp.items.length; index++) {
                                const oldProCompItem = oldProComp.items[index];
                                oldCompKey += ("_I" + oldProCompItem.id + "_C" + oldProCompItem.count);
                            }
                        }
                        console.log("Old", oldCompKey);
                        console.log("New", newCompKey);
                        if (newCompKey == oldCompKey)
                            matchComponents = true;
                    }
                    if (matchComponents) {
                        oldPro.count += product.count;
                        matchComponents = true;
                        break;
                    }
                }
                if (!matchComponents)
                    shoppingCart.products.push(product);
            }
            else
                shoppingCart.products.push(product);
            return true;
        }
        console.error("购物车未定义,请先【InitShoppingCart】!");
        return false;
    }
    DelProduct(product) {
        let shoppingCart = this.GetShoppingCartCache();
        if (shoppingCart) {
            let delIndex = -1;
            for (let index = 0; index < shoppingCart.products.length; index++) {
                const element = shoppingCart.products[index];
                if (element.id === product.id && element.scaleId === product.scaleId) {
                    let matchComponents = false;
                    if (product.components) {
                        let newCompKey = "";
                        for (let index = 0; index < product.components.length; index++) {
                            const newProComp = product.components[index];
                            newCompKey += "C" + newProComp.id;
                            for (let index = 0; index < newProComp.items.length; index++) {
                                const newProCompItem = newProComp.items[index];
                                newCompKey += ("_I" + newProCompItem.id + "_C" + newProCompItem.count);
                            }
                        }
                        let oldCompKey = "";
                        for (let index = 0; index < element.components.length; index++) {
                            const oldProComp = element.components[index];
                            oldCompKey += "C" + oldProComp.id;
                            for (let index = 0; index < oldProComp.items.length; index++) {
                                const oldProCompItem = oldProComp.items[index];
                                oldCompKey += ("_I" + oldProCompItem.id + "_C" + oldProCompItem.count);
                            }
                        }
                        if (newCompKey == oldCompKey)
                            matchComponents = true;
                    }
                    if (matchComponents) {
                        delIndex = index;
                        break;
                    }
                }
            }
            if (delIndex > -1) {
                let oldProduct = shoppingCart.products[delIndex];
                if (product.count >= oldProduct.count) {
                    shoppingCart.products.splice(delIndex, 1);
                }
                else
                    shoppingCart.products[delIndex].count -= product.count;
                return true;
            }
            console.warn("你个宝批龙,找不到这个餐品，删你个仙人板板啊!");
            return false;
        }
        console.error("购物车未定义,请先【InitShoppingCart】!");
        return false;
    }
    ClearShoppingCart() {
        return this.Cache.RemoveCache(this._shoppingCartCacheKey);
    }
    GetShoppingCartInfo() {
        return this.GetShoppingCartCache();
    }
    GetSaveOrderData() {
        let shopCart = this.GetShoppingCartCache();
        console.log(shopCart);
        let data;
        data = { info: {}, products: [] };
        if (shopCart.orderId)
            data.info.ordersId = shopCart.orderId;
        else {
            data.info = {
                deskId: shopCart.deskId,
                deskName: shopCart.deskName,
                eatType: shopCart.eatType,
                memberId: shopCart.memberId,
                person: shopCart.person
            };
        }
        data.products = this.CtorSubProducts(shopCart.products);
        if (data.products && data.products.length > 0) {
            data.products.forEach(element => {
                if (element && element.type == "zixuan") {
                    let zixuanPros = Common.GroupBy(element.products, "groupId", 1);
                    let newPros = [];
                    for (let index = 0; index < zixuanPros.length; index++) {
                        const zixuanProList = zixuanPros[index];
                        newPros.push({
                            id: index,
                            products: zixuanProList
                        });
                    }
                    element.products = newPros;
                }
            });
        }
        console.log("下单数据", data);
        return data;
    }
    CtorSubProducts(products) {
        let data = [];
        products.forEach((element) => {
            if (element) {
                let product;
                product = { id: element.id, scaleId: element.scaleId, cnt: element.count, c: element.count, components: [], type: element.type };
                if (element.exinfo)
                    product.exinfo = element.exinfo;
                if (element.scaleName)
                    product.scaleName = element.scaleName;
                if (element.groupId || element.groupId == 0)
                    product.groupId = element.groupId;
                if (element.groupName)
                    product.groupName = element.groupName;
                if (element.components && element.components.length > 0) {
                    element.components.forEach((item) => {
                        if (item) {
                            let component = { id: item.id, items: [] };
                            item.items.forEach((childItem) => {
                                if (childItem) {
                                    component.items.push({
                                        id: childItem.id,
                                        c: childItem.count
                                    });
                                }
                            });
                            product.components.push(component);
                        }
                    });
                }
                if (element.products && element.products.length > 0) {
                    product.products = this.CtorSubProducts(element.products);
                }
                data.push(product);
            }
        });
        return data;
    }
    GetImplementsService() {
        return "IShoppingCartService";
    }
}
//# sourceMappingURL=ShoppingCartService.js.map