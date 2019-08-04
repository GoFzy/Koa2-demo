/**
 * 学习使用koa-session
 * 1. 安装 npm install koa-session
 * 2. 引入 const session = require('koa-ssesion')
 * 3. 配置中间件--见下
 * 4. session 设置ctx.session.key = value
 * 5. session 获取ctx.session.key
 */
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const render = require('koa-art-template');

const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, 'public'),
  extname: '.html',
})

//配置session中间件
app.keys = ['some secret hurr']; //发送给浏览器cookie值时的加密数组
const CONFIG = {
  key: 'koa:sess',               //返回给浏览器的cookie名
  maxAge: 1000*60*10,
  overwrite: true,
  httpOnly: true,
  signed: true,                  //签名，将app.keys进行加密
  rolling: false,                //每次访问都重新设置
  renew: false,                  //在session快要过期时，更新cookie
}

app.use(session(CONFIG, app));


router.get('/session', async (ctx)=>{
  ctx.session.username = 'zyf';
  ctx.body = '<h2>Session设置成功</h2>'
});

router.get('/session/get', async (ctx)=>{
  await ctx.render('art-template', {
    title: 'koa-session学习',
    body: `<h2>session为：${ctx.session.username}</h2>`
  })
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);