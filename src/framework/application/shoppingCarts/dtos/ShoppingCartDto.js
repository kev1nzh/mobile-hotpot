export class ShoppingCartDto {
    constructor(data) {
        this.deskId = data.deskId;
        this.deskName = data.deskName ? data.deskName : data.deskId;
        this.memberId = data.memberId;
        this.person = data.person;
        this.eatType = data.eatType ? data.deskId : "堂食";
        this.totalPrice = 0;
        this.products = [];
        this.orderId = data.orderId;
    }
}
//# sourceMappingURL=ShoppingCartDto.js.map