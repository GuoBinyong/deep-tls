import type {OptionalBoolean} from "type-tls"

/**
 * 循环遍历的回调函数
 * (key,value,obj,currDepth))=> stopInfo : any
 * @param key : string      当前被遍历的属性名；
 * @param value : any       当前被遍历的属性值；
 * @param obj : any         当前被遍历的属性所属的对象；
 * @param currDepth : number    当前遍历的深度值，从 startDepth 所表示的值开始计数；
 * @returns stopInfo : any      表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 */
export type DepthLoopPropertyCallback<ThisVal> = (this: ThisVal, key: string, value: any, obj: any, currDepth: number) => any;



interface DeepLoopByRecursiveOptions<ThisVal> {
    target:object; // 必选； 被遍历的目标对象
    callback:DepthLoopPropertyCallback<ThisVal>;  // (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
    maxDepth:number;  //  要循环遍历的深度；
    thisValue: ThisVal;  // callback 回调函数的this值 ；
    startDepth: number;  // 深度的开始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
}

interface DeepLoopOwnPropertyByRecursiveOptions<ThisVal> extends DeepLoopByRecursiveOptions<ThisVal> {
    allOwnProps?: OptionalBoolean;  // 可选；默认值:undefined; 是否要遍历自身所有的属性，包不可枚举的，但不包括原型链上的属性；true：遍历对象自身（不包括原型上的）的所有属性（包括不可枚举的）； false : 只遍历对象自身中（不包括原型上的）可枚举的属性
}


/**
 * 递归遍历自身属性链中的所有属性（不包含原型上的属性）
 * @param options: DeepLoopOwnPropertyByRecursiveOptions<ThisVal>
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
function deepLoopOwnPropertyByRecursive<ThisVal>(options:DeepLoopOwnPropertyByRecursiveOptions<ThisVal>): any {
    const {target,callback, maxDepth, thisValue, startDepth,allOwnProps} = options;
    if (maxDepth <= startDepth){
        return ;
    }

    if (allOwnProps){
        var keyList = Object.getOwnPropertyNames(target);
    } else {
        keyList = Object.keys(target);
    }

    const nextDepth = startDepth + 1;
    //中止遍历
    var stopInfo;

    for (const key of keyList){
        const value = (<any>target)[key];
        if (typeof value === "object"){
            stopInfo = deepLoopOwnPropertyByRecursive<ThisVal>({target:value,callback,maxDepth,thisValue,startDepth:nextDepth,allOwnProps});
            if (stopInfo){
                break;
            }
        }

        stopInfo = callback.call(thisValue,key,value,target,nextDepth);
        if (stopInfo){
            break;
        }

    }


    return stopInfo;
}



/**
 * deepLoop的公共选项
 * @property  maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
 * @property  thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
 */
export interface DeepLoopOptions<ThisVal = any> {
    maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
    thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
}

/**
 * deepLoopOwnPropertyOptions的选项
 * @property allOwnProps?: OptionalBoolean;  // 可选；默认值:undefined; 是否要遍历自身所有的属性，包不可枚举的，但不包括原型链上的属性；true：遍历对象自身（不包括原型上的）的所有属性（包括不可枚举的）； false : 只遍历对象自身中（不包括原型上的）可枚举的属性
 */
export interface DeepLoopOwnPropertyOptions<ThisVal = any> extends DeepLoopOptions<ThisVal>{
    allOwnProps?: OptionalBoolean;  // 可选；默认值:undefined; 是否要遍历自身所有的属性，包不可枚举的，但不包括原型链上的属性；true：遍历对象自身（不包括原型上的）的所有属性（包括不可枚举的）； false : 只遍历对象自身中（不包括原型上的）可枚举的属性
}






/**
 * 递归遍历自身属性链中的所有属性（不包含原型上的属性）
 * @param target : object   必选； 被遍历的目标对象
 * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 * @param options ?:DeepLoopOwnPropertyOptions<ThisVal>|null|undefined   可选；选项对象；可配置的属性如下：
 *    @property  maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
 *    @property  thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
 *    @property allOwnProps?: OptionalBoolean;  // 可选；默认值:undefined; 是否要遍历自身所有的属性，包不可枚举的，但不包括原型链上的属性；true：遍历对象自身（不包括原型上的）的所有属性（包括不可枚举的）； false : 只遍历对象自身中（不包括原型上的）可枚举的属性
 * 
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
export function deepLoopOwnProperty<Target extends object>(target:Target,callback: DepthLoopPropertyCallback<Target>, options?:{
    maxDepth?:number|null|undefined,
    allOwnProps?: OptionalBoolean,
    thisValue?:undefined,
}|null|undefined
): any;
export function deepLoopOwnProperty<Target extends object,ThisVal extends Exclude<any, undefined>>(target:Target,callback: DepthLoopPropertyCallback<ThisVal>, options:{
    maxDepth?:number|null|undefined,
    allOwnProps?: OptionalBoolean,
    thisValue:ThisVal
}|null|undefined): any;
export function deepLoopOwnProperty<Target extends object,ThisVal>(target:Target,callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, options?:DeepLoopOwnPropertyOptions<ThisVal>|null|undefined): any;
export function deepLoopOwnProperty<Target extends object,ThisVal>(target:Target,callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, options?:DeepLoopOwnPropertyOptions<ThisVal>|null|undefined): any {
    const {maxDepth,thisValue,allOwnProps} = options || {};

    return deepLoopOwnPropertyByRecursive({
        target,
        callback,
        maxDepth:maxDepth == undefined ? Infinity : maxDepth,
        thisValue:(thisValue === undefined ? target : thisValue) as (ThisVal extends undefined ? Target : ThisVal),
        startDepth:0,
        allOwnProps
    });
}










/**
 * 递归遍历自身包括原型的属性链中的所有可枚举的属性
 * @param options:DeepLoopByRecursiveOptions<ThisVal>
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
function  deepLoopPropertyWithPrototypeByRecursive<ThisVal>(options:DeepLoopByRecursiveOptions<ThisVal>): any {
    const {target,callback, maxDepth, thisValue, startDepth} = options;
    if (maxDepth <= startDepth){
        return ;
    }

    const nextDepth = startDepth + 1;
    //中止遍历
    var stopInfo;

    for (const key in target){

        const value = (<any>target)[key];
        if (typeof value === "object"){
            stopInfo = deepLoopPropertyWithPrototypeByRecursive<ThisVal>({target:value,callback,maxDepth,thisValue,startDepth:nextDepth});
            if (stopInfo){
                break;
            }
        }

        stopInfo = callback.call(thisValue,key,value,target,nextDepth);
        if (stopInfo){
            break;
        }
    }

    return stopInfo;
}






/**
 * 递归遍历自身包括原型的属性链中的所有可枚举的属性
 * @param target : object   必选； 被遍历的目标对象
 * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 * @param options ?:DeepLoopOptions<ThisVal>|null|undefined   可选；选项对象；可配置的属性如下：
 *    @property  maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
 *    @property  thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
 * 
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
export function deepLoopPropertyWithPrototype<Target extends object>(target: Target, callback: DepthLoopPropertyCallback<Target>, options?: {
                                                                         maxDepth?: number | null | undefined,
                                                                         thisValue?: undefined,
                                                                     } | null | undefined
): any;
export function deepLoopPropertyWithPrototype<Target extends object,ThisVal extends Exclude<any, undefined>>(target: Target, callback: DepthLoopPropertyCallback<ThisVal>, options: {
                                                                         maxDepth?: number | null | undefined,
                                                                         thisValue: ThisVal,
                                                                     } | null | undefined
): any;
export function  deepLoopPropertyWithPrototype<Target extends object,ThisVal>(target:Target,callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, options?:DeepLoopOptions<ThisVal>|null|undefined): any;
export function  deepLoopPropertyWithPrototype<Target extends object,ThisVal>(target:Target,callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, options?:DeepLoopOptions<ThisVal>|null|undefined): any {
    const {maxDepth, thisValue} = options || {};
    return deepLoopPropertyWithPrototypeByRecursive({
        target,
        callback,
        maxDepth: maxDepth == undefined ? Infinity : maxDepth,
        thisValue:(thisValue === undefined ? target : thisValue) as (ThisVal extends undefined ? Target : ThisVal),
        startDepth:0
    });
}
