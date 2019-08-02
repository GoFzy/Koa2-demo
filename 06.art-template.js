/**
 * 学习使用art-template模板引擎
 * 1. 安装 npm install art-template koa-art-template --save-dev
 * 2. 引入 const render = require('koa-art-template');
 * 3. 配置模板引擎--见下
 * 4. 相关语法见官方文档 art-template npm
 */
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const render = require('koa-art-template');

const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, 'public'),         //配置文件目录
  extname: '.html',                              //配置文件扩展名
  debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
})

router.get('/', async(ctx)=>{
  await ctx.render('art-template', {
    title: 'art-template使用',
    body: '<h2><%-就不会被转义<h2>'
  })
})

app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
/**
 * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
 */

app.listen(3000);