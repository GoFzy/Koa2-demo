/**
 * koa-cookie使用学习
 * 1. ctx.cookies.get(name, [options])        读取上下文请求中的cookie
 * 2. ctx.cookies.set(name, value, [options]) 在上下文中写入cookie
 * koa2 中操作的cookies是使用了npm的cookies模块，源码在https://github.com/pillarjs/cookies
 * */
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const render = require('koa-art-template');

const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, 'public'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})

router.get('/', async (ctx) => {
  ctx.cookies.set(
    'koa-cookie',
    'this is koa cookie',
    {
      domain: 'localhost',              //允许拿到cookie的域名
      path: '/cookie',                  //允许拿到cookie的路径
      maxAge: 1000 * 60 * 10,           //cookie有效时长 毫秒
      expires: new Date('2019-8-3'),    //cookie失效的时间
      httpOnly: true,                   //只允许服务端使用，前端拿不到cookie
      overwrite: false,                 //是否允许重写
    }
  )
  await ctx.render('art-template', {
    title: '学习使用koa-cookie',
    body: '<h2>cookie设置成功</h2>'
  })
})

router.get('/cookie', async (ctx) => {
  const cookie = ctx.cookies.get('koa-cookie');
  await ctx.render('art-template', {
    title: '拿到koa-cookie',
    body: `<h2>${cookie}</h2>`
  })
})

/**
 * 以下解决cookie中设置中文
 * new Buffer()方法已经废弃
 * Buffer.from(待转换内容, 当前格式--个人理解用于解析).toString(转换后格式)
 */
router.get('/chinese', async (ctx) => {
  ctx.cookies.set(
    'koa-cookie-ZN',
    Buffer.from('我是中文cookie', 'utf-8').toString('base64'), //转换成 base64 字符
    {
      domain: 'localhost',              //允许拿到cookie的域名
      path: '/chinese/cookie',          //允许拿到cookie的路径
      maxAge: 1000 * 60 * 10,           //cookie有效时长 毫秒
      expires: new Date('2019-8-3'),    //cookie失效的时间
      httpOnly: true,                   //只允许服务端使用，前端拿不到cookie
      overwrite: false,                 //是否允许重写
    }
  )
  await ctx.render('art-template', {
    title: '学习使用koa-cookie',
    body: '<h2>cookie设置成功</h2>'
  })
})

router.get('/chinese/cookie', async (ctx)=>{
  const cookie = ctx.cookies.get('koa-cookie-ZN');
  const text = Buffer.from(cookie, 'base64').toString('utf-8'); //还原
  await ctx.render('art-template', {
    title: '拿到koa-cookie',
    body: `<h2>${text}</h2>`
  })
})

app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
/**
 * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
 */

app.listen(3000);