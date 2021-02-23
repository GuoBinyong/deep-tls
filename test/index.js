let deepTls = require("../dist/deep-tls.cjs")


let gby = {
    name:"郭斌勇",
    contactWay:{
        email:"guobinyong@qq.com",
        weixin:"keyanzhe"
    }
};

let gby2 = {
    name:"郭斌勇",
    contactWay:{
        email:"guobinyong@qq.com",
        weixin:"keyanzhe"
    }
};

let dyx = {
    name:"代艳霞",
    contactWay:{
        email:"dai_yanxia@qq.com",
        weixin:"jianai"
    }
};

console.log(deepTls.isDeepEqual(gby,gby2));
console.log(deepTls.isDeepEqual(gby,dyx));




deepTls.deepLoopOwnProperty(gby,function(){
    console.log(arguments)
});