/**
 * 建议看下 koa-views的官方文档--npm
 * 安装ejs 以后可以使用其他的模板引擎
 * 关于ejs 它可以通过include 拿到其他目录下的公用ejs文件--看看文档
 * 其他语法看文档 <$- <% <%=以及公用ejs渲染抽象
 */

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');

const app = new Koa();
const router = new Router();

//配置第三方中间件--views
app.use(
  views(__dirname + '/public', {
      extension: 'ejs'              //文件后缀名是ejs就好
  })
  // views(__dirname + '/public', { //如果是这样配置views中间件，那么模板文件的后缀名必须都是html
  //   map: {
  //     html: 'ejs'
  //   }
  // })
);

router.get('/view', async (ctx) => {
  await ctx.render('CSU', {        //这是一个异步方法，所以要加上await
    body: '我是一个模板引擎'
  });
})

app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
/**
 * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
 */

app.listen(3000);