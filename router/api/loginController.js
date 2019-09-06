
function loginRouter(router){
    router.use(async(ctx,next)=>{
        if(ctx.method == "HEAD"){
            ctx.set("Content-Type","application/json");
            ctx.body = {
                "name" : "head"
            }
            await next();
        }else{
            await next();
        }
    })
    router.get('/login',ctx=>{
        if(ctx.method == "GET"){
            if(!ctx.session.views){
                ctx.session.views = 1;
            }else{
                ctx.session.views++;
            }
            ctx.body = `这是你第${ctx.session.views}次光临`;
        }
        
    })
}

module.exports = loginRouter;