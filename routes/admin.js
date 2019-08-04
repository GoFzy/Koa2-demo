import Router from 'koa-router';
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'admin';
})

router.get('/users', async(ctx) => {
  ctx.body = 'users';
})

export default router;