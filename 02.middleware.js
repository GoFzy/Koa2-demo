const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

/**
 * 1. 应用级中间件--就是匹配所有路由之前都会做的操作，
 * 注意 在应用级中间件逻辑执行完毕之后，要使用next()，否则将不会继续匹配路由
 */

app.use(async (ctx, next)=>{
  console.log(Date.now());
  next();                     //没有next方法将会在此处停止
  if(ctx.status === 404) {
    ctx.status = 404;         //由于错误处理中间件的存在，需要重新设置一下状态码
    ctx.body = '未找到该页面'
  }
});

router.get('/', async (ctx, next) => {
  ctx.body = '学习koa中间件'
})

/**
 * 2. 路由级中间件
 * 个人理解 路由中间件就是一直使用next向下匹配
 */

router.get('/router', async (ctx, next)=>{
  console.log('这是一个路由中间件');
  next();
})

router.get('/router', async (ctx, next)=>{
  ctx.body = "这是渲染结果"
})

/**
 * 3. 错误处理中间件
 * 直接写在应用级中间件next()之后，这是洋葱模型的一大特点
 */

//启动路由
app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
  /**
   * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
   */

app.listen(3000);

