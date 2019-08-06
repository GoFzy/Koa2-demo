# Koa最小系统搭建

## 一、目录结构
```sh
Koa-demo
|—— bin                   
│    ├── www.js           服务启动文件
|—— routes                路由目录
|—— middleware            中间件目录
|—— public                静态资源目录
|—— views                 渲染模板目录
|—— app.js                服务启动入口
```

## 二、路由的定义
项目采用了路由模块化的方式，将路由从服务入口文件 `app.js` 中进行了抽离，使用方式如下:
```js
//新建路由文件 routes/home.js
import Router from 'koa-router';
const router = new Router();

router.get('', async (ctx) => {
  await ctx.render('template', {
    title: '首页',
    body: 'Koa2 最小系统的首页'
  })
})
export default router;


//app.js中引入路由文件
import home from './routes/home';
.....
router.use('/', home.routes());
```

补充`koa-router` 学习资料：https://github.com/zhangxiang958/zhangxiang958.github.io/issues/38

## 三、中间件的定义
最小系统中一共使用了四类中间件:
* 应用级中间件
* 第三方中间件
* 路由级中间件
* 错误处理中间件

### 3.1 应用级中间件
系统中定义了一个统计页面加载时长的中间件，并应用于所有页面：
```js
//定义中间件  ./middleware/load.js
export default function userAgent() {
  return async (ctx, next) => {
    const start = Date.now()

    await next()

    const responseTime = (Date.now() - start)
    console.log(`${ctx.host + ctx.url}响应时间为: ${responseTime / 1000}s`)
  }
}

//app.js 中添加中间件
import loadStat from './middleware/load';
...
app..use(loadStat());
```

### 3.2 第三方中间件
第三方中间件使用比较简单，直接在 `app.js` 引入并作为应用级添加即可：
```js
import bodyParser from 'koa-bodyparser'; //解析请求数据
import staticFile from 'koa-static';     //配置静态文件目录
import render from 'koa-art-template';   //配置模板引擎

render(app, {
  root: path.join(__dirname, 'views'),          //配置文件目录
  extname: '.html',                             //配置文件扩展名
  debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
})

app
  .use(bodyParser())
  .use(staticFile(path.resolve(__dirname, 'pbulic')));
```

### 3.3 路由级中间件
路由级中间件定义的方式与统计页面加载时长中间件一致，只不过在使用时，只需要添加在响应的路由上即可。  
最小系统中，定义了一个判断请求来源(移动端和 `PC` 端)的中间件--- `user_agent` :
```js
//定义中间件 ./middleware/user_agent.js

//给对应路由添加中间件 ./routes/admin.js
import userAgent from '../middleware/user_agent';

router.get('/users', userAgent(), async(ctx) => {
  await ctx.render('template',{
    title: `koa-demo${ctx.url}`,
    body: `当前访问路径:${ctx.host + ctx.url}`,
  })
})
```

### 3.4 错误处理中间件
错误处理中间件本质上也是应用级中间件，在最小系统中主要是处理访问到未定义页面的错误：
```js
//app.js
app.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
      ctx.status = 404;         //由于错误处理中间件的存在，需要重新设置一下状态码
      ctx.body = '未找到该页面'
    }
  })
```
这里需要牢记 `Koa2`洋葱模型的执行顺序，最小系统中将该中间件写在首位，这样能保证最后执行错误处理中间件 `await next()` 之后的代码，即保证已定义的页面状态码都不是404。

## 四、配置babel
在最小系统当中，统一将 `CommonJS` 模块语法替换为了 `ES6 Module` 语法。即使用`import export` 进行模块的导入和输出。  
想要实现上述目标，就需要使用到 `babel` 编译器。系统中在服务启动文件 `./bin/www.js` 中简单的使用了 `babel` 插件：
```js
// ./bin/www.js
require('@babel/register') ({
  presets: ['@babel/env']
})

require('@babel/polyfill');

module.exports = require('../app');
```
### 4.1 @babel/register
官网对其介绍为
> `@babel/register` 使用 `Node` 的 `require()` 钩子系统（`hook system`） 在加载文件时即时编译文件  

个人理解，该插件会对之后 `require` 引入的文件进行实时编译，安装方法:
```sh
npm install @babel/core @babel/register
```

### 4.2 @babel/env 预设插件
个人理解，该插件可以根据运行环境自动将 `ES2015+` 的代码转换为 `ES5` ，正如官网所说：
> @babel/preset-env is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!

安装方法:
```sh
npm install  @babel/preset-env
```

### 4.3 @babel/polyfill 垫片
`babel` 默认只转换新的 `ES6` 语法，而不转换新的 `API` ，比如 `Iterator`、`Set`、`Map`等全局对象，以及一些定义在全局对象上的方法(比如 `Object.assign`)。如果想让 `Node` 环境完全支持我们的 `ES6` 代码就需要为当前还款提供一个垫片，安装：
```sh
npm install --save @babel/polyfill
```
> Because this is a polyfill (which will run before your source code), we need it to be a dependency, not a devDependency

该插件会在我们的源代码之前运行，所以需要将它作为 `dependency` 安装。需要注意的是，`@babel/polyfill` 的工作原理是当运行环境中并没有实现一些方法时，该插件会给其做兼容，即直接在对象的原型链上增加方法。这样做的缺点是会污染全局变量，而且这样项目打包后体积会增加很多。

### 4.4 @babel/plugin-transform-runtime
该插件是针对 `@babel/polyfill` 插件做的一个改良插件，为了不污染全局对象和内置的对象原型，但同时又想体验新鲜语法，就可以使用该插件  
```sh
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime  
```
**注意**：前者是开发环境依赖，后者是生产环境依赖  
**不足**：不能转码实例方法，比如:
```js
'!!!'.repeat(3);
'hello'.includes('h');
```
这时就只能使用 `babel-polyfill`插件。  

关于 `babel`，在本系统中只是简单的使用，具体介绍可以去[官网详细阅读](https://www.babeljs.cn/docs/)  
其他 `babel` 参考文章：
* @babel-register  https://www.babeljs.cn/docs/babel-register
* @babel/preset-env  https://www.babeljs.cn/docs/babel-preset-env
* @babel/polyfill  https://www.babeljs.cn/docs/babel-polyfill
* @babel/plugin-transform-runtime  https://babeljs.io/docs/en/babel-plugin-transform-runtime
* babel-polyfill VS babel-runtime  https://juejin.im/post/5a96859a6fb9a063523e2591