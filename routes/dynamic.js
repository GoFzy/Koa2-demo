import Router from 'koa-router';
const router = new Router();

router.get('/:id/:aid', ctx => {
  const res = JSON.stringify(ctx.params, null, 2);
  ctx.body = `当前访问参数${res}`;
  console.log('params', ctx.params);
})

export default router;