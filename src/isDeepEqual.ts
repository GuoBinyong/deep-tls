import {isIterable} from "type-tls"


/**
 * isDeepEqual(a, b, nullNotEqualUndefined)
 * 深度测试  a 和 b 是否完全相等；如果 a 和 b 是 对象，会进行递归相等测试，只有所有的属性 都相等时，才会认为是相等的；
 *
 * 注意：
 * - 对于 值为 undefined 的属性 和 不存在的属性 认为是相等的属性；
 * - 对于 对于 函数 ，如果整个函数的代码字符（fun.toString()）串相等，则认为函数是相等的；
 * - 目前只判断了 基础类型、Object、Array、function、Date、可迭代 类型；
 * - 对于可迭代类型，必须迭代 索引 和 索引对应的值 都相等才认为是相等的；
 *
 * @param a : any
 * @param b : any
 * @param nullNotEqualUndefined ? : boolean    可选；默认值：false;  是否把 null 和 undefined 作为不等的值来对待
 * @param strict ? : boolean    可选；默认值：false;  是否使用严格相等来对 基本类型的值 进行比较
 * @return boolean
 */
export function isDeepEqual(a: any, b: any, nullNotEqualUndefined?: boolean,strict?:boolean): boolean {



    if (strict){
        if  (nullNotEqualUndefined){
            var equalTest = function (a:any,b:any) {return a === b}
        }else {
            equalTest = function (a,b) {return a === b || (a == null && b == null)}
        }
    }else {
        if  (nullNotEqualUndefined){
            equalTest = function (a,b) {return  a == null ? a === b : a == b}
        }else {
            equalTest = function (a,b) {return a == b}
        }

    }





    if (equalTest(a,b) || Object.is(a,b)) {
        return true
    }else if (a == null || b == null){
        return equalTest(a,b)
    }


    var aType = typeof a;
    var bType = typeof b;


    if (aType != bType ) { //测试 基础类型 与 其包装类型 的相等性
        return  equalTest(a.valueOf ? a.valueOf() : a,b.valueOf ? b.valueOf() : b)
    }

    if  (aType == "function"){
        return  equalTest(a,b) || equalTest(a.toString(),b.toString());
    }



    if (aType == "object") {
        if (a instanceof Date){
            return equalTest(a.valueOf(),b.valueOf());
        }

        if (a instanceof Map){
            if  (b instanceof Map && a.size === b.size){
                for (const [key,aVal] of a){
                    if  (!(b.has(key) && isDeepEqual(aVal, b.get(key), nullNotEqualUndefined,strict))){
                        return false;
                    }
                }
                return true;
            }
            return false;
        }




        var aIsArr = Array.isArray(a);
        var bIsArr = Array.isArray(b);

        if (!aIsArr && isIterable(a)){
            var aArr = [];
            for (const value of a){
                aArr.push(value);
            }
            a = aArr;
            aIsArr = true;
        }

        if (!bIsArr && isIterable(b)){
            var bArr = [];
            for (const value of b){
                bArr.push(value);
            }

            b = bArr;
            bIsArr = true;
        }


        if (aIsArr != bIsArr) {
            return false;
        }



        if (aIsArr) {
            if (a.length != b.length) {
                return false;
            }

            return a.every(function (aValue:any, index:number) {
                var bValue = b[index];
                return isDeepEqual(aValue, bValue, nullNotEqualUndefined,strict);
            });

        }

        var aEntrs = Object.entries(a);
        var bEntrs = Object.entries(b);
        aEntrs = aEntrs.filter(function (entr) {
            return !equalTest(entr[1],undefined)
        });
        bEntrs = bEntrs.filter(function (entr) {
            return !equalTest(entr[1],undefined)
        });

        if (aEntrs.length != bEntrs.length) {
            return false;
        }

        return aEntrs.every(function (aEntr) {
            var key = aEntr[0];
            var aValue = aEntr[1];
            var bValue = b[key];
            return isDeepEqual(aValue, bValue, nullNotEqualUndefined,strict);
        });


    }

    return equalTest(a,b);
}
