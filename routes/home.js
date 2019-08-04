import Router from 'koa-router';
const router = new Router();

router.get('', async (ctx) => {
  await ctx.render('template', {
    title: '首页',
    body: 'Koa2 最小系统的首页'
  })
})


export default router;