import Router from 'koa-router';
import userAgent from '../middleware/user_agent';

const router = new Router();

router.get('/users', userAgent(), async(ctx) => {
  await ctx.render('template',{
    title: `koa-demo${ctx.url}`,
    body: `当前访问路径:${ctx.host + ctx.url}`,
  })
})

router.get('/', async (ctx) => {
  await ctx.render('template',{
    title: `koa-demo${ctx.url}`,
    body: `当前访问路径:${ctx.host + ctx.url}`,
  })
})

export default router;