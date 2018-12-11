export class ProductDto {
    constructor(data) {
        this.id = data.id;
        this.scaleId = data.scaleId;
        this.count = data.count;
        this.components = data.components;
        this.name = data.name;
        this.scaleName = data.scaleName;
        this.price = data.price;
        this.type = data.type;
        this.limit = data.limit;
        this.products = data.subProducts;
        this.exinfo = data.exinfo;
        this.groupId = data.groupId;
        this.groupName = data.groupName;
    }
}
//# sourceMappingURL=ProductDto.js.map