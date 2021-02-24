[深拷贝文档]: https://github.com/GuoBinyong/deep-copy
[介绍与安装]: ../README.md

目录
=====

<!-- TOC -->

- [1. 相关文章](#1-相关文章)
- [2. deepCopy()](#2-deepcopy)
- [3. createDeepCopy()](#3-createdeepcopy)
- [4. isDeepEqual()](#4-isdeepequal)
- [5. DepthLoopPropertyCallback](#5-depthlooppropertycallback)
- [6. DeepLoopOptions](#6-deeploopoptions)
- [7. DeepLoopOwnPropertyOptions](#7-deeploopownpropertyoptions)
- [8. deepLoopOwnProperty()](#8-deeploopownproperty)
- [9. deepLoopPropertyWithPrototype()](#9-deeplooppropertywithprototype)

<!-- /TOC -->


内容
======

# 1. 相关文章
- [deep-tls的介绍与安装][介绍与安装]

# 2. deepCopy()
详情请参数 [深拷贝文档][]
# 3. createDeepCopy()
详情请参数 [深拷贝文档][]


# 4. isDeepEqual()
```
function isDeepEqual(a: any, b: any, nullNotEqualUndefined?: boolean, strict?: boolean): boolean;
```
深度测试  a 和 b 是否完全相等；如果 a 和 b 是 对象，会进行递归相等测试，只有所有的属性 都相等时，才会认为是相等的；

* @param a : any
* @param b : any
* @param nullNotEqualUndefined ? : boolean    可选；默认值：false;  是否把 null 和 undefined 作为不等的值来对待
* @param strict ? : boolean    可选；默认值：false;  是否使用严格相等来对 基本类型的值 进行比较
* @return boolean

**注意：**  
* - 对于 值为 undefined 的属性 和 不存在的属性 认为是相等的属性；
* - 对于 对于 函数 ，如果整个函数的代码字符（fun.toString()）串相等，则认为函数是相等的；
* - 目前只判断了 基础类型、Object、Array、function、Date、可迭代 类型；
* - 对于可迭代类型，必须迭代 索引 和 索引对应的值 都相等才认为是相等的；



# 5. DepthLoopPropertyCallback
```
type DepthLoopPropertyCallback<ThisVal> = (this: ThisVal, key: string, value: any, obj: any, currDepth: number) => any;
```
循环遍历的回调函数，简化的类型描述为 `(key,value,obj,currDepth))=> stopInfo : any`
* @param key : string      当前被遍历的属性名；
* @param value : any       当前被遍历的属性值；
* @param obj : any         当前被遍历的属性所属的对象；
* @param currDepth : number    当前遍历的深度值，从 startDepth 所表示的值开始计数；
* @returns stopInfo : any      表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；


# 6. DeepLoopOptions
```
interface DeepLoopOptions<ThisVal = any> {
    maxDepth?: number | null | undefined;
    thisValue?: ThisVal;
}
```
deepLoop的公共选项
* @property  maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
* @property  thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；


# 7. DeepLoopOwnPropertyOptions
```
interface DeepLoopOwnPropertyOptions<ThisVal = any> extends DeepLoopOptions<ThisVal> {
    allOwnProps?: OptionalBoolean;
}
```
deepLoopOwnPropertyOptions的选项
* @property allOwnProps?: OptionalBoolean;  // 可选；默认值:undefined; 是否要遍历自身所有的属性，包不可枚举的，但不包括原型链上的属性；true：遍历对象自身（不包括原型上的）的所有属性（包括不可枚举的）； false : 只遍历对象自身中（不包括原型上的）可枚举的属性



# 8. deepLoopOwnProperty()
```
function deepLoopOwnProperty<Target extends object, ThisVal>(target: Target, callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, options?: DeepLoopOwnPropertyOptions<ThisVal> | null | undefined): any;
```
递归遍历自身属性链中的所有属性（不包含原型上的属性）
* @param target : object   必选； 被遍历的目标对象
* @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
* @param options ?:DeepLoopOwnPropertyOptions<ThisVal>|null|undefined   可选；选项对象；可配置的属性如下：
   - @property  maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
   - @property  thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
   - @property allOwnProps?: OptionalBoolean;  // 可选；默认值:undefined; 是否要遍历自身所有的属性，包不可枚举的，但不包括原型链上的属性；true：遍历对象自身（不包括原型上的）的所有属性（包括不可枚举的）； false : 只遍历对象自身中（不包括原型上的）可枚举的属性
* @returns stopInfo ： any   终止循环时返回的信息；
 



# 9. deepLoopPropertyWithPrototype()
```
function deepLoopPropertyWithPrototype<Target extends object, ThisVal>(target: Target, callback: DepthLoopPropertyCallback<ThisVal extends undefined ? Target : ThisVal>, options?: DeepLoopOptions<ThisVal> | null | undefined): any;
```

递归遍历自身包括原型的属性链中的所有可枚举的属性

* @param target : object   必选； 被遍历的目标对象
* @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 startDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 deepLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
* @param options ?:DeepLoopOptions<ThisVal>|null|undefined   可选；选项对象；可配置的属性如下：
   * @property  maxDepth?:number|null|undefined;  // 可选；默认值为：Infinity,即无限深度；要循环遍历的最大深度；当值为 undefined 或 null 时，会使用默认值，表示无限深度；被循环遍历的值本身的深度为 0 ，被循环遍历值的成员的深度为 1 ，依次类推；
   * @property  thisValue?: ThisVal;     // 可选；  callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
* @returns stopInfo ： any   终止循环时返回的信息；