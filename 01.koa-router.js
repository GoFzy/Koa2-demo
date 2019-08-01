const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

/**
 * 1. 基础使用
 */
router.get('/', async (ctx, next) => {
  ctx.body = 'router使用'
  next();
})

/**
 * 2. koa路由传值
 */

router.get('/value', async (ctx, next) => {
  // ctx.body = ctx.query;       //获取的是对象格式 即{key: value}
  // ctx.body = ctx.querystring; //获取的是字符串格式 即 key=value&key2=value2
  ctx.body = ctx.request.url;    //获取的是整个url路径
  //也可以这样 ctx.request.query or ctx.request.querystring 太麻烦了
})

/**
 * 3. 动态路由
 * 能多匹配一级 ctx.param获取一个对象 {key: param}
 */
router.get('/dynamic/:param', async (ctx, next) => {
  ctx.body = ctx.params;
})


//启动路由
app
  .use(router.routes())          //启动路由
  .use(router.allowedMethods()); //非必须设置
  /**
   * 作用：官方文档的推荐用法，根据ctx.status 设置 response 响应头
   */




app.listen(3000);