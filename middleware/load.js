/**
 * 用于统计页面加载时长
 */
export default function userAgent() {
  return async (ctx, next) => {
    const start = Date.now()

    await next()

    const responseTime = (Date.now() - start)
    console.log(`${ctx.host + ctx.url}响应时间为: ${responseTime / 1000}s`)
  }
}