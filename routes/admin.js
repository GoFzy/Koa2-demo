const Router = require('koa-router');
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'admin';
})

router.get('/users', async(ctx) => {
  ctx.body = 'users';
})

module.exports = router;