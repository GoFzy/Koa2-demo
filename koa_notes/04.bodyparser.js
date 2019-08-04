/**
 * 获取表单提交数据--两种方式
 * 第一种：koa原生方式
 * 第二种：bodyparser npm install koa-bodyparser --save-dev
 * 建议在npm上看看文档  
 */


/**
 * bodyparser使用
 * 1. npm安装
 * 2. 引入 const bodyparser = require('koa-bodyparser'); 
 * 3. 第三方中间件 app.use(bodyParser());
 * 4. 拿到表单内容 ctx.request.body;
 */

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const bodyparser = require('koa-bodyparser'); 

const app = new Koa();
const router = new Router();

//引入bodyparser
app.use(bodyparser());

//配置模板引擎
app.use(views(__dirname + '/public', {
  extension: 'ejs',
}))

router.get('/', async (ctx)=>{
  await ctx.render('form', {
    location: '/addinfo'
  });
})

//接收post提交的数据
router.post('/addinfo', async(ctx)=>{
  ctx.body = ctx.request.body;
})

app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
/**
 * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
 */

app.listen(3000);