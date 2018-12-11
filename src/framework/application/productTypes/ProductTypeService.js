import { BaseApplicationService } from "../BaseApplicationService";
import { ProductType } from "../../core/entities/productTypes/ProductType";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { GetCacheInput } from "../../core/cache/dtos/GetCacheInput";
import { EsQuery } from "../../core/repository/dtos/EsQuery";
import { AddCacheDto } from "../../core/cache/dtos/AddCacheDto";
export class ProductTypeService extends BaseApplicationService {
    constructor() {
        super();
        this._allProductTypesCacheKey = "AllProductTypes";
        this._rProductType = RepositoryFactory.GetRepositoryInstance(ProductType);
        this.Cache.AddCache(new AddCacheDto(this._allProductTypesCacheKey, null, 1000 * 60 * 120));
    }
    GetBrandProductTypes() {
        let that = this;
        let input = new GetCacheInput(this._allProductTypesCacheKey, function () {
            let query = new EsQuery({
                Filter: {
                    brandId: "#",
                    allStore: true
                },
                Size: 100
            });
            return that._rProductType.GetAll(query).then(res => {
                let data = res.data;
                let taoCanType = { name: "固定套餐", id: "-1", sortIndex: 0, allStore: true };
                data.push(taoCanType);
                let zixuanType = { name: "自选套餐", id: "-2", sortIndex: 0, allStore: true };
                data.push(zixuanType);
                return data;
            });
        });
        return this.Cache.GetCacheAsync(input);
    }
    GetImplementsService() {
        return "IProductTypeService";
    }
}
//# sourceMappingURL=ProductTypeService.js.map