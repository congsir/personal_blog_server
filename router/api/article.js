
function articleRouter(router){
    router.use(async(ctx,next)=>{
        // ctx.set('Content-Type', 'application/json;charset=utf-8')
        ctx.set("Access-Control-Allow-Origin","*");
        ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
        ctx.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Access-Control-Allow-Headers, Access-Control-Request-Headers, Access-Control-Request-Method, Authorization, X-Requested-With, User-Agent, Referer, Origin"
            )
        ctx.set("Access-Control-Max-Age", 1728000)
        if(ctx.method == "HEAD"){
            ctx.set("Content-Type","application/json");
            ctx.body = {
                "name" : "head"
            }
        }if(ctx.method == "OPTIONS"){
            ctx.body = {
                status : 200
            }
        }else{
            await next();
        }
    })
    // 首页轮播文章
    router.get('/bannerArticle',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getBannerArticle(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getBannerArticle(ctx){
        let queryStr = "SELECT id,title,cover,update_time FROM article where is_banner=1 ORDER BY update_time DESC LIMIT 5";
        let data = await ctx.db.query(queryStr);
        return data;
    }
    // 首页文章置顶
    router.get('/topArticle',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getTopArticle(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getTopArticle(ctx){
        let queryStr = "SELECT id,title,cover FROM article where is_top=1 ORDER BY update_time DESC limit 2";
        let data = await ctx.db.query(queryStr);
        return data;
    }

    // 最近更新文章
    router.get('/latestArticle',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getLatestArticle(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getLatestArticle(ctx){
        if(ctx.query.tags){
            let queryStr = "SELECT id,title,cover,update_time,type,tags,abstract FROM article where tags=? ORDER BY update_time DESC";
            let data = await ctx.db.query(queryStr,[ctx.query.tags]);
            return data;
        }else{
            let queryStr = "SELECT id,title,cover,update_time,type,tags,abstract FROM article ORDER BY update_time DESC";
            let data = await ctx.db.query(queryStr);
            return data;
        }
    }

    // 点击数最多文章
    router.get('/clickMostArticle',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getClickMostArticle(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getClickMostArticle(ctx){
        let queryStr = "SELECT id,title,cover FROM article ORDER BY read_num DESC limit 8";
        let data = await ctx.db.query(queryStr);
        return data;
    }

    //文章点击统计
    router.post('/clickArticle',async ctx=>{
        if(ctx.method == "POST"){
            let msg = await ClickArticle(ctx);
            let data = false;
            if(msg == 'success'){
                data = true;
            }else{
                data = false;
            }
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "msg" : msg
            };
        }else{
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : '',
                "msg" : 'options'
            };
        }
        
    })
    async function ClickArticle(ctx){
        let queryStr = "SELECT id , type, read_num FROM article where id=?";
        let id = ctx.request.fields.id
        let data = await ctx.db.query(queryStr,id);
        let msg = '';
        if(data && data.length>0){
            let read_num = Number(data[0].read_num) + 1;
            let updateQuery = "UPDATE article SET read_num=? where id=?";
            await ctx.db.query(updateQuery,[read_num,id]);
            msg = "success"
            return msg;
        }else{
            msg = "文章id错误,无此数据"
            return msg;
        }
        
    }

    // 特别推荐文章列表
    router.get('/specialArticle',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getSpecialArticle(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getSpecialArticle(ctx){
        let queryStr = "SELECT id,title,cover,abstract FROM article where is_special=1 ORDER BY update_time DESC limit 8";
        let data = await ctx.db.query(queryStr);
        return data;

    }

    //猜你喜欢
    router.get('/guessLikeArticle',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getGuessLikeArticle(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getGuessLikeArticle(ctx){
        let queryStr = "SELECT id,title FROM article where guess_like=1 ORDER BY update_time DESC limit 8";
        let data = await ctx.db.query(queryStr);
        return data;
    }
    // 获取文章类型
    router.get('/types',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getTypes(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getTypes(ctx){
        let queryStr = "SELECT * FROM types ORDER BY articleNum limit 5";
        let data = await ctx.db.query(queryStr);
        return data;

    }
    // 文章分类列表
    router.get('/typeArticle',async ctx=>{
        if(ctx.method == "GET"){
            if(ctx.query.type){
                let data = await getTypeArticle(ctx);
                ctx.body = {
                    "statusCode": "200",
                    "status" : "success",
                    "data" : data,
                    "total" : data.length
                };
            }else{
                ctx.body = {
                    "statusCode": "200",
                    "status" : "error",
                    "data" : [],
                    "total" : 0,
                    "msg" : "请传入文章类型参数"
                };
            }
            
        }
        
    })
    async function getTypeArticle(ctx){
        let type = ctx.query.type;
        let queryStr = "SELECT id,title,cover,abstract FROM article where type=? ORDER BY update_time DESC limit 7";
        let data = await ctx.db.query(queryStr,[type]);
        return data;
    }
    // 标签云
    router.get('/tags',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getTags(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
        
    })
    async function getTags(ctx){
        let queryStr = "SELECT * FROM tags";
        let data = await ctx.db.query(queryStr);
        return data;

    }
    // 寻找标签下的文章
    router.get('/tagArticle',async ctx=>{
        if(ctx.method == "GET"){
            if(ctx.query.tag){
                let data = await getTagArticle(ctx);
                ctx.body = {
                    "statusCode": "200",
                    "status" : "success",
                    "data" : data,
                    "total" : data.length
                };
            }else{
                ctx.body = {
                    "statusCode": "200",
                    "status" : "error",
                    "data" : [],
                    "total" : 0,
                    "msg" : "请传入文章标签参数"
                };
            }
            
        }
        
    })
    async function getTagArticle(ctx){
        let tag = '%' + ctx.query.tag + '%';
        let queryStr = "SELECT id,title,cover,abstract,tags FROM article where tags LIKE ? ORDER BY update_time DESC";
        let data = await ctx.db.query(queryStr,[tag]);
        return data;
    }

    // 时间轴
    router.get('/timeLine',async ctx=>{
        if(ctx.method == "GET"){
            let data = await getTimeLine(ctx);
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "total" : data.length
            };
        }
    })
    async function getTimeLine(ctx){
        let queryStr = "SELECT id,title,update_time FROM article ORDER BY update_time DESC";
        let data = await ctx.db.query(queryStr);
        return data;
    }

    // 文章详情
    router.get('/detailArticle',async ctx=>{
        if(ctx.method == "GET"){
            if(ctx.query.id){
                let data = await getDetailArticle(ctx);
                ctx.body = {
                    "statusCode": "200",
                    "status" : "success",
                    "data" : data,
                    "total" : data.length
                };
            }else{
                ctx.body = {
                    "statusCode": "200",
                    "status" : "error",
                    "data" : [],
                    "total" : 0,
                    "msg" : "请传入文章id参数"
                };
            }
            
        }
        
    })
    async function getDetailArticle(ctx){
        let id = ctx.query.id;
        let queryStr = "SELECT * FROM article where id=?";
        let data = await ctx.db.query(queryStr,[id]);
        return data;

    }
    // 当前文章的上一篇,下一篇id
    router.get('/preAndNext',async ctx=>{
        if(ctx.method == "GET"){
            if(ctx.query.updateTime){
                let data = await getPreAndNext(ctx);
                ctx.body = {
                    "statusCode": "200",
                    "status" : "success",
                    "data" : data,
                    "total" : data.length
                };
            }else{
                ctx.body = {
                    "statusCode": "200",
                    "status" : "error",
                    "data" : [],
                    "total" : 0,
                    "msg" : "请传入文章id参数"
                };
            }
            
        }
    })
    async function getPreAndNext(ctx){
        let updateTime = ctx.query.updateTime;
        let preQueryStr = "SELECT id,title FROM article where update_time < ? ORDER BY update_time DESC limit 1";
        let nextQueryStr = "SELECT id,title FROM article where update_time > ? ORDER BY update_time ASC limit 1";
        let preData = await ctx.db.query(preQueryStr,[updateTime]);
        let nextData = await ctx.db.query(nextQueryStr,[updateTime]);
        let data = {
            'preArticle' : preData,
            'nextArticle' : nextData
        };
        return data;

    }

    // 给文章点赞
    router.post('/zan',async ctx=>{
        if(ctx.method == "POST"){
            let msg = await zanArticle(ctx);
            let data = false;
            if(msg == 'success'){
                data = true;
            }else{
                data = false;
            }
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : data,
                "msg" : msg
            };
        }else{
            ctx.body = {
                "statusCode": "200",
                "status" : "success",
                "data" : '',
                "msg" : 'options'
            };
        }
    })

    async function zanArticle(ctx){
        let queryStr = "SELECT id , type, zan_num FROM article where id=?";
        let id = ctx.request.fields.id
        let data = await ctx.db.query(queryStr,id);
        let msg = '';
        if(data && data.length>0){
            let zan_num = Number(data[0].zan_num) + 1;
            let updateQuery = "UPDATE article SET zan_num=? where id=?";
            await ctx.db.query(updateQuery,[zan_num,id]);
            msg = "success";
            return msg;
        }else{
            msg = "文章id错误,无此数据";
            return msg;
        }
        
    }
    // 记录访问用户ip,被访问文章id,

}


module.exports = articleRouter;