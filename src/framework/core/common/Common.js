import { Md5 } from "./encrypt/Md5";
export class Common {
    static GetGuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let index = 0; index < 36; index++) {
            s[index] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }
    static GetUuid() {
        let guid = this.GetGuid();
        return guid.replace(new RegExp("-", "gm"), "");
    }
    static Md5Encrypt(str) {
        return Md5.hashStr(str);
    }
    static GroupBy(array, key, type) {
        let groups = {};
        array.forEach(function (o) {
            let group = o[key];
            if (typeof group == "string" || typeof group == "number") {
                groups[group] = groups[group] || [];
                groups[group].push(o);
            }
            else
                throw new Error("分组Key不是String | Number 格式!");
        });
        if (type) {
            return Object.keys(groups).map(function (group) {
                return groups[group];
            });
        }
        return groups;
    }
    static Distinct(array, key) {
        let temp = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (index == 0)
                temp.push(element);
            else {
                let hasThis;
                if (key)
                    hasThis = temp.filter((p) => p[key] == element[key])[0];
                else
                    hasThis = temp.filter((p) => p == element)[0];
                if (!hasThis) {
                    temp.push(element);
                }
            }
        }
        return temp;
    }
    static Sum(array, key) {
        let sum = 0;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let val = key ? element[key] : element;
            if (typeof val == "string")
                sum += Number(val);
            else if (typeof val == "number")
                sum += val;
            else
                throw new Error("请聚合[Number]类型");
        }
        return +sum.toFixed(2);
    }
}
//# sourceMappingURL=Common.js.map