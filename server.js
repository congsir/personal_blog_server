const koa = require("koa");
const Router = require("koa-router");
const betterBody = require("koa-better-body");
const path = require("path");
const session = require("koa-session");
const fs  = require("fs");

const config = require("./config");
const static = require("./router/static");
const db = require("./dao/db.js"); 

const server = new koa();
server.context.config = config;  //将config对象挂载到ctx原型上

//中间件,betterBody,文件与普通post数据经过koa-better-body处理后都在ctx.request.fields字段上
server.use(betterBody({
    uploadDir : path.resolve(__dirname,'./static/upload')
}));

// 处理数据库
server.context.db = db;

// session
server.keys = fs.readFileSync('.keys').toString().split('\n');
server.use(session({
    key: 'koa:blog', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 20*60*1000,  //session有效期 20min
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
},server))


// router与static

const router = new Router();
server.use(router.routes());

router.use('/api',require('./router/api'));

static(router,{});


server.listen(config.port);
console.log(`server is runing on ${config.port}`);