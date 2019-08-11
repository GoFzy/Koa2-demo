import Router from 'koa-router';

const router = new Router();
router.prefix('/koa');

/**
 * 上述方法等价于
 * const router = new Router({
 *     prefix: '/koa'
 * })
 */

// 等同于"/koa/:id"
router.get('/:id', (ctx) => {
  ctx.body = `koa router prefix ${ctx.params.id}` ;
});

router.get('/', (ctx) => {
  ctx.body = 'koa router prefix';
});

export default router;