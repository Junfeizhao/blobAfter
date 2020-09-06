const Koa = require('koa')
const app = new Koa();
const routes =  require("./router") ;
const Router = require('koa-router')
const router = new Router();
const cors = require('koa-cors') 
const bodyParser = require('koa-bodyparser')
const compress = require('koa-compress');
const session = require('koa-session');
const staticServer = require('koa-static');
//session配置
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间(默认:false)
    renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
// app.use(koaBody({
//     multipart: true,
//     // formidable: {
//     //     maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
//     // }
// }));


const options = { threshold: 2048 };
app.use(compress(options));
app.use(staticServer(__dirname, 'public'));

app.use(bodyParser())
app.use(cors({
  origin: "*",
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'], //设置允许的HTTP请求类型
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
//挂载路由
app.use(routes.routes(), routes.allowedMethods());
app.listen(80, () => {
    console.log('localhost:3000')
})

