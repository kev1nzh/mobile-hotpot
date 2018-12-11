export class MemberInfo {
    constructor(memberId, mobile, brandId, gradeId) {
        this.LGV = 0;
        this.balance = 0;
        this.brandId = brandId ? brandId : 100224;
        this.consumerCnt = 0;
        this.disCount = 0;
        this.gradeId = gradeId;
        this.gradeName = undefined;
        this.id = 0;
        this.integral = 0;
        this.isPwd = 0;
        this.memberId = memberId;
        this.mobile = mobile;
        this.openNosecret = 0;
        this.originalNo = undefined;
        this.realName = undefined;
        this.sex = undefined;
    }
}
//# sourceMappingURL=MemberInfo.js.map