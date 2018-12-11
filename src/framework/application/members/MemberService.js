import { BaseApplicationService } from "../BaseApplicationService";
import { SysInfo } from "../../core/entities/systems/SysInfo";
import { Common } from "../../core/common/Common";
export class MemberService extends BaseApplicationService {
    constructor() {
        super(...arguments);
        this._urls = {
            AccountLogin: "IAccounts/login",
            MemberInfoByToken: "IMembers/memberInfo",
            MemberInfoByIds: "IMembers/membersById",
            MemberCouponList: "IMembers/couponList",
            UpdateMemberInfo: "IMembers/updateInfo",
            SMemberLogin: "IMembers/sMemberLogin",
            SMemberLoginByCode: "IMembers/sMemberLoginCode",
            MemberLogin: "IMembers/login",
            IntergralList: "IMembers/integralList",
            AccountLogList: "IMembers/accountLogList",
            ResetPassword: "IMembers/resetPwd",
            UpDateInfo: 'IMembers/updateInfo',
            BindingMobile: 'IMembers/bindingMobile',
            CheckPhone: 'IMembers/checkMobile',
            BindPhone: "IMembers/bindingMobile",
        };
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudStoreApi + url;
    }
    GetImplementsService() {
        return "IMemberService";
    }
    GetMembersByIds(ids) {
        if (ids.length < 1) {
            return Promise.resolve([]);
        }
        let filter = {
            p: {
                brandId: "#",
                memberIds: ids
            }
        };
        return this.Request.Request("POST", this._urls.MemberInfoByIds, filter);
    }
    GetMemberInfo(memberId) {
        if (memberId) {
            return this.GetMembersByIds([memberId]).then((res) => {
                if (res && res.length > 0)
                    return res[0];
                return null;
            });
        }
        else {
            return this.GetMemberInfoByToken();
        }
    }
    GetMemberInfoByPhoneOrMemberId(idOrPhone) {
        if (idOrPhone === "") {
            return Promise.resolve(null);
        }
        let filter = { brandId: "#" };
        if (idOrPhone.length == 11)
            filter.mobile = idOrPhone;
        else
            filter.memberId = idOrPhone;
        let url = this.GetFullUrl(this._urls.SMemberLogin);
        return this.Request.Request("POST", url, { p: filter }).then((res) => {
            if (res && res.result.message == "")
                return res.result.data;
            return null;
        });
    }
    GetMemberCoupons() {
        let url = this.GetFullUrl(this._urls.MemberCouponList);
        let reqData = {
            p: { token: "#" }
        };
        return this.Request.Request("POST", url, reqData).then((res) => {
            if (res && res.result.message == "") {
                let result = res.result.data;
                return result;
            }
            return [];
        });
    }
    GetMemberInfoByToken() {
        let url = this.GetFullUrl(this._urls.MemberInfoByToken);
        let reqData = {
            p: { storeId: "#", token: "#" }
        };
        return this.Request.Request("POST", url, reqData).then((res) => {
            if (res && res.result.message == "")
                return res.result.data;
            return null;
        });
    }
    AccountLogin(info) {
        if (info.phone == "" || info.password == "") {
            throw new Error("账号或者密码为空");
        }
        let url = this.GetFullUrl(this._urls.AccountLogin);
        return this.Request.Request("POST", url, {
            p: {
                mobile: info.phone,
                pwd: info.password
            }
        }).then(res => {
            if (res) {
                let token = {
                    loginToken: res.loginToken,
                    token: res.token
                };
                let sysInfo = new SysInfo({
                    sysId: res.account.id,
                    sysName: res.account.loginName,
                    sysPhone: res.account.mobile,
                    token: token
                });
                this.ConfigCenter.SetSysInfo(sysInfo);
                return res;
            }
            return null;
        }, err => {
            console.error("登录失败", err);
            return null;
        });
    }
    MemberLogin(info) {
        if (info.phone == "" || info.password == "") {
            throw new Error("账号或者密码为空");
        }
        let url = this.GetFullUrl(this._urls.MemberLogin);
        return this.Request.Request("POST", url, {
            p: {
                channel: "h5",
                mobile: info.phone,
                pwd: Common.Md5Encrypt(info.password),
                brandId: "#",
                storeId: "#"
            }
        }).then(res => {
            if (res && res.result.message == "") {
                let token = {
                    loginToken: res.result.data.token,
                    token: res.result.data.token
                };
                let sysInfo = new SysInfo({
                    memberId: res.result.data.memberId,
                    token: token
                });
                this.ConfigCenter.SetSysInfo(sysInfo);
                return res.result.data;
            }
            return null;
        }, err => {
            console.log("登录失败", err);
            return null;
        });
    }
    GetIntegralList(info) {
        let url = this.GetFullUrl(this._urls.IntergralList);
        let reqData = {
            p: {
                page: info.page,
                token: "#"
            }
        };
        return this.Request.Request("POST", url, reqData).then(e => {
            if (e.result) {
                return e.result.data;
            }
        });
    }
    GetAccountLogList(info) {
        let url = this.GetFullUrl(this._urls.AccountLogList);
        let reqData = {
            p: {
                page: info.page,
                token: "#"
            }
        };
        return this.Request.Request("POST", url, reqData).then(e => {
            if (e.result) {
                return e.result.data;
            }
        });
    }
    ResetPassword(info) {
        let url = this.GetFullUrl(this._urls.ResetPassword);
        let reqData = {
            p: {
                pwd: Common.Md5Encrypt(info.pwd),
                token: "#"
            }
        };
        return this.Request.Request("POST", url, reqData).then(e => {
            if (e.result) {
                return e.result.data;
            }
        });
    }
    UpdateSex(info) {
        let url = this.GetFullUrl(this._urls.UpDateInfo);
        let reqData = {
            p: {
                sex: info.sex,
                token: "#"
            }
        };
        return this.Request.Request("POST", url, reqData).then(e => {
            if (e.result) {
                return e.result.data;
            }
        });
    }
    UpDateBirthday(info) {
        let url = this.GetFullUrl(this._urls.UpDateInfo);
        let reqData = {
            p: {
                birthday: info.birthday,
                token: "#"
            }
        };
        return this.Request.Request("POST", url, reqData).then(e => {
            if (e.result) {
                return e.result.data;
            }
        });
    }
    UpDateMobile(info) {
        let url = this.GetFullUrl(this._urls.BindingMobile);
        let reqData = {
            p: {
                token: "#",
                brandId: '#',
                storeId: '#',
            }
        };
        return this.Request.Request("POST", url, reqData).then(e => {
            if (e.result) {
                return e.result.data;
            }
        });
    }
    GetMemberSSoToken() {
        let url = `${this.GlobalUrl.SsoApi}genToken`;
        return this.Request.Request("GET", url, { token: "#" });
    }
    CheckMemberPhone(phone) {
        let result = { success: false, message: "" };
        if (!phone || phone.length != 11) {
            console.warn("手机号格式错误!");
            result.message = "手机号格式错误";
            return Promise.resolve(result);
        }
        let url = this.GetFullUrl(this._urls.CheckPhone);
        let reqData = {
            mobile: phone,
            brandId: "#"
        };
        return this.Request.Request("POST", url, { p: reqData }).then((res) => {
            if (res.result.status == 1) {
                result.success = true;
                result.message = res.result.message;
            }
            else {
                result.success = false;
                result.message = "手机未注册!";
            }
            return result;
        });
    }
    MemberLoginByCode(phone, code) {
        let result = { success: false, message: "", data: null };
        if (!phone || phone.length != 11) {
            console.warn("手机号格式错误!");
            result.message = "手机号格式错误";
            return Promise.resolve(result);
        }
        if (!code || code.length < 4 || code.length > 8) {
            console.warn("验证码格式错误!");
            result.message = "验证码格式错误!";
            return Promise.resolve(result);
        }
        let url = this.GetFullUrl(this._urls.SMemberLoginByCode);
        let reqData = {
            mobile: phone,
            brandId: "#",
            code: code,
            type: "mobilecode"
        };
        return this.Request.Request("POST", url, { p: reqData }).then((res) => {
            console.log(res);
            if (res && res.result && res.result.message == "") {
                result.success = true;
                result.data = res.result.data;
            }
            else
                result.message = res.result.message;
            return result;
        });
    }
    BindPhoneForMember(data) {
        let result = { success: false, message: "", data: null };
        if (!data.phone || data.phone.length != 11) {
            console.warn("手机号格式错误!");
            result.message = "手机号格式错误";
            return Promise.resolve(result);
        }
        if (!data.code || data.code.length < 4 || data.code.length > 8) {
            console.warn("验证码格式错误!");
            result.message = "验证码格式错误!";
            return Promise.resolve(result);
        }
        let url = this.GetFullUrl(this._urls.BindPhone);
        let reqData = {
            mobile: data.phone,
            code: data.code,
            type: "mobilecode",
            pwd: data.password,
            token: "#"
        };
        return this.Request.Request("POST", url, { p: reqData }).then((res) => {
            console.log(res);
            if (res && res.result && res.result.message == "") {
                result.success = true;
                result.data = res.result.data;
            }
            else
                result.message = res.result.message;
            return result;
        });
    }
}
//# sourceMappingURL=MemberService.js.map