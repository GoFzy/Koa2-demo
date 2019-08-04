import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

//引入子模块路由
import admin from './routes/admin';

app.use(bodyParser());

//配置子路由，层级路由--下例中以/admin 为入口，进入admin文件继续匹配路由
router.use('/admin', admin.routes());

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000);