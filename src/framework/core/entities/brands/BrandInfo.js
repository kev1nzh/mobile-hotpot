export class BrandInfo {
    constructor(brandId, brandName) {
        this.brandId = brandId ? brandId : 0;
        this.brandName = brandName ? brandName : "";
    }
    ImplementsIBrand() {
        return true;
    }
}
//# sourceMappingURL=BrandInfo.js.map