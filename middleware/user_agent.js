function checkUserInfo(userAgent) {
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  for (let item of Agents) {
    if (userAgent.indexOf(item) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export default function userAgent() {
  return async function (ctx, next) {
    const isPC = checkUserInfo(ctx.header['user-agent']);
    await next();
    await ctx.render('template', {
      title: `koa-demo${ctx.url}`,
      body: `当前访问来自:${isPC ? 'PC端' : '移动端'}`,
    })
  }
}
