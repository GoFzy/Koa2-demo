/**
 * koa-static 静态资源中间件 静态web服务
 * 1. 安装 npm isntall koa-static
 * 2. 引入 const static = require('koa-static');
 * 3. 配置中间件 app.use(static('你的静态资源目录'))
 * 
 * 个人理解：
 * koa中不能直接通过link标签引入css等静态资源，需要koa-staic配置文件目录
 * 在页面中引入时可以省略css文件的路径，直接写文件名即可
 */

const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const views = require('koa-views');

const app = new Koa();
const router = new Router();

app.use(static('public/css'));

app.use(views(__dirname + '/public', {
  extension: 'ejs',
}));

router.get('/csu', async (ctx)=>{
  await ctx.render('csu', {
    body: 'koa-static学习'
  });
})

app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
/**
 * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
 */

app.listen(3000);