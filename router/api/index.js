const Router = require("koa-router");

const router = new Router();

router.get("/a",async ctx=>{
    if(ctx.method == "GET"){
        ctx.set("Content-Type","application/json");
        let queryStr = "SELECT * FROM article";
        let data = await ctx.db.query(queryStr);
        let num = ++data[0].read_num;
        addReadNum(data[0].id,ctx,num);
        ctx.body = JSON.stringify(data);
    }else{
        ctx.body = "not get"
    }
})

// 增加文章阅读数
function addReadNum(id,ctx,num){
    let queryStr = "UPDATE article SET read_num = ? where id = ?";
    ctx.db.query(queryStr,[num,id]);
}

require('./loginController')(router);   //登录相关接口
require("./article.js")(router);        //文章相关接口


module.exports = router.routes();