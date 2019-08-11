import Router from 'koa-router';
const router = new Router();

router
  .param('id', (id, ctx, next)=>{
    if(id.length > 4) console.log('id大于4');
    return next();
  })
  .param('aid', (aid, ctx, next) => {
    if(aid.length > 4) console.log('aid大于4');    
    return next();
  })
  .get('/:id/:aid', ctx => {
    const res = JSON.stringify(ctx.params, null, 2);
    ctx.body = `当前访问参数${res}`;
    console.log('params', ctx.params);
  })

export default router;