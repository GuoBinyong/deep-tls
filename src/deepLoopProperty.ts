/**
 * 循环遍历的回调函数
 * (key,value,obj,currDepth))=> stopInfo : any
 * @param key : string      当前被遍历的属性名；
 * @param value : any       当前被遍历的属性值；
 *  @param obj : any         当前被遍历的属性所属的对象；
 *  @param currDepth : number    当前遍历的深度值，从 startDepth 所表示的值开始计数；
 *  @returns stopInfo : any      表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 */
export type DepthLoopPropertyCallback<ThisVal> = (this: ThisVal, key: string, value: any, obj: any, currDepth: number) => any;






/**
 * 递归遍历自身属性链中的所有属性（不包含原型上的属性）
 * @param target : object   必选； 被遍历的目标对象
 * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 * @param maxDepth  : number    要循环遍历的深度；
 * @param thisValue  : any    callback 回调函数的this值 ；
 * @param startDepth  : number   深度的开始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
 * @param all ? : boolean    可选；默认值: false ;  是否遍历自身所有的属性，包括不可枚举的；
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
function deepLoopOwnPropertyByRecursive<ThisVal>(target:object,callback:DepthLoopPropertyCallback<ThisVal>, maxDepth:number, thisValue: ThisVal, startDepth: number,all?: boolean): any {

    if (maxDepth <= startDepth){
        return ;
    }

    if (all){
        var keyList = Object.getOwnPropertyNames(target);
    } else {
        keyList = Object.keys(target);
    }

    const nextDepth = startDepth + 1;
    //中止遍历
    var stopInfo;

    for (let key of keyList){
        let value = (<any>target)[key];
        if (typeof value === "object"){
            stopInfo = deepLoopOwnPropertyByRecursive(value,callback,maxDepth,thisValue,nextDepth,all);
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
 * 递归遍历自身属性链中的所有属性（不包含原型上的属性）
 * @param target : object   必选； 被遍历的目标对象
 * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 * @param maxDepth ? : number|null    可选；默认值：Infinity ,即无限深度； 要循环遍历的深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；
 * @param all ? : boolean    可选；默认值: false ;  是否遍历自身所有的属性，包括不可枚举的；
 * @param thisValue ? : any    可选；   callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
export function deepLoopOwnProperty<Target extends object,ThisVal>(target:Target,callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, maxDepth?:number|null, all?: boolean, thisValue?: ThisVal): any {
    if (maxDepth == undefined){
        maxDepth = Infinity;
    }

    return deepLoopOwnPropertyByRecursive(target,callback,maxDepth,(thisValue === undefined ? target : thisValue) as (ThisVal extends undefined ? Target : ThisVal),0,all);
}










/**
 * 递归遍历自身包括原型的属性链中的所有可枚举的属性
 * @param target : object   必选； 被遍历的目标对象
 * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
 * @param maxDepth  : number    要循环遍历的深度；
 * @param thisValue  : any    callback 回调函数的this值 ；
 * @param startDepth  : number   深度的开始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
function  deepLoopPropertyWithPrototypeByRecursive<ThisVal>(target:object,callback: DepthLoopPropertyCallback<ThisVal>, maxDepth: number, thisValue: ThisVal, startDepth: number): any {
    if (maxDepth <= startDepth){
        return ;
    }

    const nextDepth = startDepth + 1;
    //中止遍历
    var stopInfo;

    for (let key in target){

        let value = (<any>target)[key];
        if (typeof value === "object"){
            stopInfo = deepLoopPropertyWithPrototypeByRecursive(value,callback,maxDepth,thisValue,nextDepth);
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
 * @param maxDepth ? : number|null    可选；默认值：Infinity ,即无限深度； 要循环遍历的深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；
 * @param thisValue ? : any    可选；   callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
 * @returns stopInfo ： any   终止循环时返回的信息；
 */
export function  deepLoopPropertyWithPrototype<Target extends object,ThisVal>(target:Target,callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, maxDepth?:number|null, thisValue?: ThisVal): any {
    if (maxDepth == undefined){
        maxDepth = Infinity;
    }

    return deepLoopPropertyWithPrototypeByRecursive(target,callback,maxDepth,(thisValue === undefined ? target : thisValue) as (ThisVal extends undefined ? Target : ThisVal),0);
}
