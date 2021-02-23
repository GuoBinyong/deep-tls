[API接口文档]: ./docs/API.md

[GitHub仓库]: https://github.com/GuoBinyong/deep-tls
[发行地址]: https://github.com/GuoBinyong/deep-tls/releases
[issues]: https://github.com/GuoBinyong/deep-tls/issues

[码云仓库]: https://gitee.com/guobinyong/deep-tls



[循环引用]: ./docs/assets/循环引用.svg

目录
=========

<!-- TOC -->

- [1. 背景](#1-背景)
- [2. 简介](#2-简介)
- [3. 安装方式](#3-安装方式)
    - [3.1. 方式1：通过 npm 安装](#31-方式1通过-npm-安装)
    - [3.2. 方式2：直接下载原代码](#32-方式2直接下载原代码)
    - [3.3. 方式3：通过`<script>`标签引入](#33-方式3通过script标签引入)
- [4. API接口文档](#4-api接口文档)

<!-- /TOC -->


内容
=====



# 1. 背景
开发中，经常需要对一个对象进行深拷贝、深度遍历、深度相等测试等操作，就拿深拷贝来说，目前经常用到的深拷贝的方式有以下几种：
- 将对象序列化成 JSON 字符串后，再反序化成对象 `let copy = JSON.parse(JSON.stringify(value))`
- 第三方库提供的深拷贝工具，如 Lodash 的 `_.cloneDeep(value)` 和 `_.cloneDeepWith(value, customizer)`

但这些方法有以下缺点：
- 不支持对象成员循环引用，比如下面这种：
   ![循环引用][]
- 拷贝后会丢失类型信息，变成了普通的对象
- 拷贝后会丢失成员引用关系信息
- 不能根据类型自定义拷贝规则
- 只能拷贝可枚举的属性
- 不能拷贝函数
- 不能指定拷贝深度


为了解决这些问题，**deep-tls** 就出现了👏




# 2. 简介
deep-tls 是一个深度操作的工具集合，目前包括 深拷贝、深度遍历、深度相等判断 等等；

其中，深拷贝可对任意数据进行深度拷贝，包括 函数 function、正则 RegExp、Map、Set、Date、Array、URL 等等；支持含循环引用关系的对象的拷贝，并且不会丢失成员的引用关系信息 和 类型信息，支持扩展，可根据数据类型定制拷贝逻辑，也可指定拷贝深度；所以，通过它可实现对任意类型的数据进行任意想要的拷贝；

**具有以下特性：**  
- 支持对象成员循环引用
- 拷贝后不会丢失类型信息 和 成员引用关系信息
- 可指定拷贝深度
- 即能拷贝可枚举的成员，也可拷贝不可枚举的成员
- 可拷贝函数
- 可根据类型自定义拷贝规则
- 支持预设拷贝规则
- 支持创建多个不同预设拷贝规则的拷贝函数

**详情请看：**  
- 主页：<https://github.com/GuoBinyong/deep-tls>
- [GitHub仓库][]
- [码云仓库][]
- [API接口文档][]


**如果您在使用的过程中遇到了问题，或者有好的建议和想法，您都可以通过以下方式联系我，期待与您的交流：**
- 给该仓库提交 [issues][]
- 给我 Pull requests
- 邮箱：<guobinyong@qq.com>
- QQ：guobinyong@qq.com
- 微信：keyanzhe





# 3. 安装方式
目前，安装方式有以下几种：


## 3.1. 方式1：通过 npm 安装
```
npm install deep-tls
```

## 3.2. 方式2：直接下载原代码
您可直接从项目的 [发行地址][] 下载 源码 或 构建后包文件；

您可以直接把 源码 或 构建后 的包拷贝到您的项目中去；然后使用如下代码在您的项目中引入您需要使用的深度工具：
```
import { deepCopy,createDeepCopy,deepLoopOwnProperty,deepLoopPropertyWithPrototype,isDeepEqual } from "path/to/package/deep-tls";
```




## 3.3. 方式3：通过`<script>`标签引入
您可直接从项目的 [发行地址][] 中下载以 `.iife.js` 作为缀的文件，然后使用如下代码引用 和 使用 deep-tls：


1. 引用 deep-tls
   ```
   <script src="path/to/package/deep-tls.iife.js"></script>
   ```
   
2. 使用全局的 `deepTls`
   ```
   <script>
   // 使用全局的 deepTls
       const copy = deepTls.deepCopy(value);
   </script>
   ```


# 4. API接口文档
详情跳转至[API接口文档][]



--------------------

> 有您的支持，我会在开源的道路上，越走越远

![赞赏码](https://i.loli.net/2020/04/08/PGsAEqdJCin1oQL.jpg)