import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';
import bodyParser from 'koa-bodyparser';
import staticFile from 'koa-static';
import render from 'koa-art-template';
import loadStat from './middleware/load';

const app = new Koa();
const router = new Router();

//引入子模块路由
import admin from './routes/admin';
import home from './routes/home';
import dynamic from './routes/dynamic';

//配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),          //配置文件目录
  extname: '.html',                             //配置文件扩展名
  debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
})

//配置应用级 & 第三方 & 错误处理中间件
app
  .use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
      ctx.status = 404;         //由于错误处理中间件的存在，需要重新设置一下状态码
      ctx.body = '未找到该页面'
    }
  })
  .use(bodyParser())
  .use(loadStat())
  .use(staticFile(path.resolve(__dirname, 'pbulic')));

//配置子路由，层级路由--下例中以/admin 为入口，进入admin文件继续匹配路由
router.use('/', home.routes());
router.use('/admin', admin.routes());
router.use('/dynamic', dynamic.routes());

app
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
});