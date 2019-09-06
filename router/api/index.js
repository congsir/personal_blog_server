const Router = require("koa-router");

const router = new Router();

router.get("/a",ctx=>{
    ctx.set("Content-Type","application/json");
    ctx.body = '{"name":"cong"}'
})

require('./loginController')(router);   //登录相关接口

module.exports = router.routes();