const static = require("koa-static");

// 设置静态资源缓存，图片30天，js 1天  css 1天 html 30天 other其它资源7天
module.exports =  function(router,{image=30,script=1,styles=1,html=30,others=7}={}){
    router.all(/((\.jpg)|(\.png)|(\.gif))$/i,static('./static',{
        maxAge:image*86400*1000
    }))
    router.all(/((\.js)|(\.jsx))$/i,static('./static',{
        maxAge:script*86400*1000
    }))
    router.all(/((\.css))$/i,static('./static',{
        maxAge:styles*86400*1000
    }))
    router.all(/((\.html)|(\.htm))$/i,static('./static',{
        maxAge:html*86400*1000
    }))
    router.all("*",static('./static',{
        maxAge:others*86400*1000
    }))
}
