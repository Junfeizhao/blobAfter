const Router = require('koa-router')
let router = new Router();
const utils =require("./api/util")
const userService = require('./controllers/userService'); 
const mysql  = require('mysql')
const maile =require("./api/mailer")
const multer = require('koa-multer');




router.get("/",async (ctx,next)=>{
   let sql ="select * from user";
     let a = await userService.query(sql);
     ctx.body = {
        data: {
            name: 'test'
        },
        status: {
            code: 0,
            message: "success"
        }
    }
})


router.post("/api/getUserInfo",async (ctx,next)=>{
    let uid=ctx.request.body.params.uid.toString();
    console.log(ctx.session.users[uid],uid);
    var isAlive = ctx.session.users[uid];
    if(isAlive){
        let sql =`select * from user where id =  ${uid}`;
        let user = await userService.query(sql);
        data=user[0]||[];
        ctx.body={status:0,data:data,message:'alive'}
    }else{
        ctx.body={status:505,data:[],message:'登录状态失效'}
    }
  
   
 })

 router.post("/api/removeUserInfo",async (ctx,next)=>{
    let uid=ctx.request.body.params.uid.toString();
    ctx.session.users[uid]=null;
    console.log(ctx.session.users[uid])
    ctx.body={status:0,data:[],message:'删除成功'}
 })


router.post("/api/login",async ctx=>{
    let account=ctx.request.body.params.account;
    let password=ctx.request.body.params.password;
    let remember = ctx.request.body.params.remember;
    let sql =`select * from user where account =  "${account}" `;
//    console.log(sql)
   let user = await userService.query(sql);
   let status;
   if(!user[0]){
       status={code:500,message:"账号不存在"}
        
   }else{
        if(user[0].password!=password){
            status={code:501,message:"密码错误"}
        }else{
           status= {code:0,message:"登陆成功"}
           ctx.session.users=ctx.session.users||{};
           ctx.session.users[`${user[0].id}`]='alive';
           console.log(ctx.session.users);
           status.uid=user[0].id;
        }   
   }
   ctx.body = await {
    data: user[0],
    status:status
}

})

router.post("/api/register",async ctx=>{
    let r_user=ctx.request.body.params;
    console.log(r_user,7771)
    let res= await userService.query(`select * from user where account="${r_user.email}"`)
    if(res.length>0){
        console.log("邮箱已被注册",res)
        ctx.body={
            data:{},
            status:{
                code:500,
                msg:"邮箱已被注册!"
            }
        }
        return
    }
     await userService.addUserData({account:r_user.email,password:r_user.password,nickname:r_user.nickname});
     ctx.body={
        data:{},
        status:{
            code:0,
            msg:"注册成功"
        }
    }
     
})

router.post("/api/getCode",ctx=>{
   
    var info = ctx.request.body.params;


    //生成验证码
    var code="";
    for (let i = 0 ; i < 6 ; i ++) {
        code = code + Math.floor(Math.random() * 9 + 1);
    }
    console.log(ctx.request.body)
    let receiver = ctx.request.body.params.receiver;
    console.log(66,receiver)
     maile(receiver,code);
    ctx.body = {
        data: {
            code:code
        },
        status:{
            code:0,
            message:"success"
        }
    }
})


router.get("/api/silder", async ctx=>{
    let sql = `SELECT * FROM silder`;
    let re = await userService.query(sql);
     ctx.body={
         data:re[0],
         status:{
             code:0,
             msg:"success"
         }
     }
})


router.post("/api/getAllArticle",async ctx=>{
    var params = ctx.request.body.params;
    console.log(params);
    var re = await userService.query(`select article.id,article.uid,article.createTime,article.title,article.description,
    user.avatar,user.nickname from article inner join user on article.uid=user.id where article.classify='${params.classify}'`);
    ctx.body={data:re,status:{code:0,message:'success'}}
})

router.post("/api/searchArticle",async ctx=>{
    var keyWords = ctx.request.body.params.keyWords;
     console.log(keyWords);
    var re = await userService.query(`select article.id,article.uid,article.createTime,article.title,article.description,
    user.avatar,user.nickname from article inner join user on article.uid=user.id where article.title like '%${keyWords}%' or article.description like '%${keyWords}%' or article.content like '%${keyWords}%'`);
    console.log(re);
    ctx.body={
        status:{
            code:0,
            msg:'成功',
        },
        data:re
    }

})

router.post('/api/articleDetail',async ctx=>{
    var aid = ctx.request.body.params.aid;
    var article = await userService.query(`SELECT content FROM article WHERE id =${aid}`);
    // console.log(article)
    // console.log(article[0])
    ctx.body={
        data:article[0],
        status:{
            code:0,
            meg:'success'
        }
    }
})

router.post("/api/publish",async ctx=>{
    let createTime=utils.formDate(new Date()); //文章发布时间
    var params = ctx.request.body.params;
    // console.log(params,content);
    await userService.addArticle({title:params.title,description:params.description,content:params.content,uid:params.uid,createTime:createTime,classify:params.classify});
    ctx.body={status:'0',message:'success'}
})





//个人资料 //后期添加过滤
let storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (ctx, file, cb)=>{
        cb(null, Date.parse(new Date())+'.jpg');
    }
});
let upload = multer({ storage: storage });

router.post('/api/avatar', upload.single('avatar'), async ctx => {
    var uid = ctx.req.body.uid; 
    var filePath = ctx.req.file.path.replace(/\\/g,'/');
    console.log(filePath);
    var sql = `UPDATE user SET avatar='${filePath}' WHERE id =${uid}`;
    await userService.query(sql);
    ctx.body='success'
});

router.post('/api/basicSettings', async ctx => {
    var params = ctx.request.body.params;
    await userService.query(`UPDATE user SET nickname='${params.nickname}',signature='${params.signature}', birthday='${params.birthday}' WHERE id =${params.uid}`);
    console.log(params)
    ctx.body='success'
});

module.exports=router

