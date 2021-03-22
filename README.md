#### REALWORLD项目

##### 介绍

- GitHub仓库：https://github.com/gothinkster/realworld
- 在线示例：https://demo.realworld.io/#/
- 接口文档：https://github.com/gothinkster/realworld/tree/master/api
- 页面模板：https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INS TRUCTIONS.md

##### 创建项目

```js
// 在nuxt-js-demo创建realworld-nuxtJS分支
git checkout -b realworld-nuxtJS
# 生成 package.json 文件
npm init -y
# 安装 nuxt 依赖
npm install nuxt
```

在 package.json 中添加启动脚本：

```json
"scripts": {
    "dev": "nuxt"
}
```

创建pages/index.vue

```vue
<template>
<div>
    <h1>Home Page</h1>
    </div>
</template>
<script>
    export default {
        name: 'HomePage'
    }
</script>
<style>
</style>
```

启动项目：

```js
npm run dev
```

此时在浏览器访问http://localhost:3000/ 测试。

##### 导入样式文件

在项目根目录创建app.html页面，导入nuxt.js[默认的html](https://zh.nuxtjs.org/docs/2.x/concepts/views/#document-apphtml)

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
    <head {{ HEAD_ATTRS }}>
        {{ HEAD }}
        <!-- 引入样式文件 -->
        <!-- Import Ionicon icons & Google Fonts our Bootstrap theme relies on -->
        <link
              href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css"
              rel="stylesheet" type="text/css">
        <link href="//fonts.googleapis.com/css?
                    family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Sour
                    ce+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
              rel="stylesheet" type="text/css">
        <!-- Import the custom Bootstrap 4 theme from our hosted CDN -->
        <!-- <link rel="stylesheet" href="//demo.productionready.io/main.css"> -->
        <link rel="stylesheet" href="/index.css">
    </head>
    <body {{ BODY_ATTRS }}>
        {{ APP }}
    </body>
</html>
```

##### 创建nuxt.config.js文件

```js
module.exports = {
  router: {
    linkActiveClass: 'active', // 处理导航链接高亮
    // 自定义路由规则
    extendRoutes (routes, resolve) {
      // 清空基于pages目录默认生成的路由表规则
      routes.splice(0)

      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            {
              path: '', // 为空代表默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/'),
            }, {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/'),
            }, {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/'),
            }, {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/'),
            }, {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/'),
            }, {
              path: '/editor',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor/'),
            }, {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/'),
            }
          ]
        }
      ])
    }
  }
}
```

##### 导入以下对应页面 从[页面模板](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INS TRUCTIONS.md)导入

layout作为页面根路由，由头部header、子路由<nuxt-child/>和底部footer组成

![image-20210319132908067](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210319132908067.png)

##### 引入[axios](http://www.axios-js.com/) 封装请求模块

- 安装axios

  npm i axios

- 创建utils/request.js

  ```js
  import axios from 'axios'
  const request = axios.create({
      baseURL: 'https://conduit.productionready.io/'
  })
  export default request
  ```

##### 登陆注册模块

[接口文档](https://github.com/gothinkster/realworld/tree/master/api)

- 添加api/user.js文件，封装登陆注册方法

  ```js
  import { request } from '@/plugins/request'
  // 用户登录
  export const login = data => {
    return request({
      method: 'POST',
      url: '/api/users/login',
      data
    })
  }
  // 用户注册
  export const register = data => {
    return request({
      method: 'POST',
      url: '/api/users',
      data
    })
  }
  ```

- 在login组件中根据路由调用登陆或注册接口

- 为了防止刷新页面数据丢失，我们需要把数据持久化把登陆状态存到Cookie中 

  ```js
  // login/index.vue
  
  // 登陆成功后，为了防止刷新页面数据丢失，我们需要把数据持久化 把登陆状态存到Cookie中 
  // 浏览器刷新cookie数据不会消失
  Cookie.set('user', data.user)
  
  // store/index.js
  // 要使用cookie中的数据初始化vuex中的数据 保持登陆状态
  export const actions = {
    // nuxtServerInit 是一个nuxt提供的特殊的 action 方法
    // 这个 action 会在服务端渲染期间自动调用，且仅在服务端中运行
    // 作用：初始化容器数据，以及需要传递数据给客户端使用的数据
    // commit提交mutations的方法 req服务端渲染期间的请求对象
    nuxtServerInit ({ commit }, { req }) {
      // console.log('nuxtServerInit')
      let user = null
  
      // 服务端代码
      // 如果请求头中有 Cookie
      if (req.headers.cookie) {
        // 使用 cookieparser 把 cookie 字符串转为 JavaScript 对象
        // 接口中会自动将本地存储的cookie数据发送到服务端
        const parsed = cookieparser.parse(req.headers.cookie)
        // try...catch...防止cookie的数据格式不对
        try {
          user = JSON.parse(parsed.user)
        } catch (err) {
          // No valid cookie found
        }
      }
  
      // 提交 mutation 修改 state 状态
      commit('setUser', user)
    }
  }
  ```

- 使用中间件处理页面访问权限

  创建middleware文件夹，添加authenticated.js和notAuthenticated.js文件，用于控制页面权限

  在login/index.vue添加notAuthenticated中间件，用于控制已登录时跳转到首页，其他路由页面添加authenticated中间件用于验证是否登录

##### 布局组件layout

在layout中根据vuex中的user，判断是否登陆状态，从而header中设置不同的选项

##### 首页模块home

- 封装article.js请求

- 获取文章列表getArticles，应该在服务端渲染，所以放入asyncData中

- 根据获取到的数据格式渲染页面

- 处理分页参数 limit和offset

- 点击分页时改变路由query参数，默认情况不会调用asyncData方法，通过watchQuery监听query改变

  ```js
  watchQuery: ['page']
  ```

- 获取文章标签列表并展示

- 优化并行异步任务，使用Promise.all()实现获取tags和articles

  ```js
   // 并发执行
  const [ articleRes, tagRes ] = await Promise.all([
      loadArticles({
          limit,
          offset: (page - 1) * limit, // 数据偏移量 页数 * 大小
          tag
      }),
      getTags()
  ])
  const { data: { articles, articlesCount } } = articleRes
  const { data: { tags } } = tagRes 
  ```

- 处理标签列表链接和数据，标签中通过改变query去重新加载数据

  ```js
  watchQuery: ['page', 'tag'],
  ```

- 处理标签高亮及链接，通过监听tab的变化，改变标签的高亮及是否展示tag

  ```js
   watchQuery: ['page', 'tag', 'tab']
  ```

- 请求Your Feed标签数据，getYourFeedArticles，需要设置请求头

  ```js
  export const getYourFeedArticles = params => {
    return request({
      method: 'GET',
      url: '/api/articles/feed',
      params,
      headers: {
        // 添加用户身份，数据格式：Token空格Token数据
        Authorization: `Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDgxMTYsInVzZXJuYW1lIjoibHB6OTk5IiwiZXhwIjoxNTk3NzQxNTA4fQ.2yO8Fss4hYnvsIN2UYHsutQ1hmYqSSAA-UrIRnP4DOY`
      }
    })
  }
  ```

- 使用axios拦截器同一设置用户Token

  如果在utils/request.js中直接设置请求拦截器，不能像Vue那样直接通过`import store from '@/store'`拿到store对象，因为nuxt中的state是一个函数；所以需要将请求request.js添加到plugins中

  1. 创建plugins文件夹，将request.js移入plugins中

  2. 在nuxt.config.js中引入,~代表根目录

     ```js
     // 注册插件
     plugins: [
         '~/plugins/request.js',
     ]
     ```

  3. plugins中默认导出一个上下文对象context，包含一下内容

     ![image-20210321101529020](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210321101529020.png)

     <table>
       <thead>
         <tr>
           <th>属性</th>
           <th>类型</th>
           <th>可用</th>
           <th>描述</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td>app</td>
           <td>vue根实例</td>
           <td>客户端 &amp; 服务端</td>
           <td>包含所有插件的根实例。例如:想使用axios，可以通过context.app.$axios获取</td>
         </tr>
         <tr>
           <td>isClient</td>
           <td>Boolean</td>
           <td>客户端 &amp; 服务端</td>
           <td>是否来自客户端渲染，废弃，请使用process.client</td>
         </tr>
         <tr>
           <td>isServer</td>
           <td>Boolean</td>
           <td>客户端 &amp; 服务端</td>
           <td>是否来自服务端渲染，废弃，请使用process.server</td>
         </tr>
         <tr>
           <td>isStatic</td>
           <td>Boolean</td>
           <td>客户端 &amp; 服务端</td>
           <td>是否通过nuxt generate</td>
         </tr>
         <tr>
           <td>isDev</td>
           <td>Boolean</td>
           <td>客户端 &amp; 服务端</td>
           <td>是否开发模式，在生产坏境的数据缓存中用到</td>
         </tr>
         <tr>
           <td>isHMR</td>
           <td>Boolean</td>
           <td>客户端 &amp; 服务端</td>
           <td>是否通过模块热替换，仅在客户端以dev模式</td>
         </tr>
         <tr>
           <td>route</td>
           <td>路由</td>
           <td>客户端 &amp; 服务端</td>
           <td>路由实例</td>
         </tr>
         <tr>
           <td>store</td>
           <td>vuex数据</td>
           <td>客户端 &amp; 服务端</td>
           <td>Vuex.sttore实例</td>
         </tr>
         <tr>
           <td>env</td>
           <td>l Object</td>
           <td>客户端 &amp; 服务端</td>
           <td>nuxt.config.js中的环境变量</td>
         </tr>
         <tr>
           <td>params</td>
           <td>Object</td>
           <td>客户端 &amp; 服务端</td>
           <td>route.params的别名</td>
         </tr>
         <tr>
           <td>query</td>
           <td>Object</td>
           <td>客户端 &amp; 服务端</td>
           <td>route.query的别名</td>
         </tr>
         <tr>
           <td>req</td>
           <td>http.Request</td>
           <td>服务端</td>
           <td>Node.js API的Request对象。如果nuxt以中间件形式使用的话，这个对象就根据你所使用的框架（个人理解为页面）而定。nuxt generate 不可用</td>
         </tr>
         <tr>
           <td>res</td>
           <td>http.Reponse</td>
           <td>服务端</td>
           <td>Node.js API的Reponse对象。如果nuxt以中间件形式使用的话，这个对象就根据你所使用的框架（个人理解为页面）而定。nuxt generate 不可用</td>
         </tr>
         <tr>
           <td>redirect</td>
           <td>Function</td>
           <td>服务端</td>
           <td>用于重定向另一个路由，状态码在服务端被使用，默认302 redirect([status,]path[,query])</td>
         </tr>
         <tr>
           <td>error</td>
           <td>Function</td>
           <td>客户端 &amp; 服务端</td>
           <td>前往错误页面，error(parmas),params包含statusCode和message字段</td>
         </tr>
         <tr>
           <td>nuxtState</td>
           <td>Object</td>
           <td>客户端</td>
           <td>nuxt状态</td>
         </tr>
         <tr>
           <td>beforeNuxtRender（fn）</td>
           <td>Function</td>
           <td>服务端</td>
           <td>更新NUXT在客户端呈现的变量,具体了解请看官网</td>
         </tr>
       </tbody>
     </table>

  4. 设置axios请求拦截器，获取store中的user对象，设置token

     ```js
     // 通过插件机制获取到上下文对象
     // export default (context)
     export default ({ store }) => {
       // console.log(context)
       // 可以在拦截器中做公共业务处理 如设置token
       request.interceptors.request.use(function (config) {
         /**
          * 需要拿到vuex中的user对象
          * import store from '@/store'
          * 因为store都是通过export按需导出
          * 需要按需加载import { state } from '@/store'
          * 此时拿到的state是一个函数 需要调用一下此函数
          * 这样拿到的数据永远是null
          * 不同于客户端渲染 所以需要放入到plugins中
          */
         const { user } = store.state
       
         if (user && user.token) {
           config.headers.Authorization = `Token ${user.token}`
         }
       
         // 返回 config 请求配置对象
         return config
       }, function (error) {
         // 如果请求失败(此时请求还没有发出去)就会进入这里
         // Do something with request error
         return Promise.reject(error)
       })
     }
     ```

- 处理文章发布时间格式化

  使用[dayjs](https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/README.zh-CN.md)，比moment更轻量，封装全局过滤器（在plugins中创建）

- 文章点赞

  asyncData中请求数据后，设置文章点赞的disabled状态

  ```js
  articles.forEach(article => article.favoriteDisabled = false)
  ```

  文章点赞或取消点赞时，需要在请求时处理点赞按钮状态

##### 文章详情

- 通过getArticle获取文章详情，需要在服务端渲染，请求放入asyncData中

- 使用[markdown-it](https://markdown-it.docschina.org/#%E7%94%A8%E6%B3%95%E7%A4%BA%E4%BE%8B)将markdown格式转为HTML，使用v-html渲染页面

- 展示文章作者相关信息，封装组件`article-meta.vue`，传入article文章详情进行渲染

- 设置页面meta优化SEO，nuxt使用vue-meta更新应用的头部标签Head和html属性，可以在nuxt.config.js中定义，也可以设置个性化特定页面的meta标签

  ```js
  // 设置页面title和description对SEO非常有用
  head () {
      return {
          title: this.title,
          meta: [
              { hid: 'description', name: 'description', content: 'My custom description' }
          ]
      }
  }
  ```

- 通过客户端渲染展示评论列表

##### 发布文章

添加成功后调用createArticle创建文章，并跳转到文章详情页

##### 用户中心



##### 个人中心

##### 发布部署-打包

Nuxt.js 提供了一系列常用的 [命令](https://zh.nuxtjs.org/docs/2.x/get-started/commands/),用于开发或发布部署

| 命令          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| nuxt          | 启动一个热加载的Web服务器（开发模式） localhost:3000。       |
| nuxt build    | 利用webpack编译应用，压缩JS和CSS资源（发布用）。             |
| nuxt start    | 以生产模式启动一个Web服务器 (需要先执行 nuxt build )。       |
| nuxt generate | 编译应用，并依据路由配置生成对应的HTML文件 (用于静态站点的部署)。 |

部署 Nuxt.js 服务端渲染的应用不能直接使用 nuxt 命令，而应该先进行编译构建nuxt build，然后再启动 Nuxt 服务nuxt start

常见的命令有：

-  --config-file 或 -c : 指定 nuxt.config.js 的文件路径。
-  --spa 或 -s : 禁用服务器端渲染，使用SPA模式 
- --unix-socket 或 -n : 指定UNIX Socket的路径。

###### 最简单的部署方式

- 配置Host + Port

  在nuxt.config.js中添加

  ```js
  // 生产环境服务器
  server: {
      host: '0.0.0.0', // 默认localhost 如果配置到生产环境时要设置为0.0.0.0，监听所有网卡地址，不然无法访问
      port: 3000
  },
  ```

- 压缩发布包

  ![image-20210321140231600](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210321140231600.png)

  .nuxt目录和static目录以及nuxt配置文件；package.json和package-lock.json是因为需要在服务端安装第三方包

  压缩这五个文件到一个压缩包

- 把发布包传到服务端

  在vs Code终端中链接远程服务器

  ```shell
  ssh root@106.75.190.29
  ```

  将压缩包上传到服务器对应地址

  ```shell
  scp ./xxx.zip root@106.75.190.29:/root/realworld-nuxtjs
  ```

- 解压
  unzip 解压

- 安装依赖

  1. 在服务器上安装 nvm   参考: https://github.com/nvm-sh/nvm

     ```shell
     wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
     ```

  2. 重启ssh终端后, 查看 nvm 版本

     ```shell
     nvm --version
     ```

  3. 安装 Node.js lts 长期支持版

     ```shell
     nvm install --lts
     ```

  4. 安装依赖

     ```shell
     cnpm i
     ```

- 启动服务

  `npm run dev`启动服务

###### 使用PM2启动Node服务

在服务器上是通过`npm run start`命令启动web服务，最终执行的是nodeJs下的相关脚本启动。此时如果退出命令行，服务就会被关闭，导致访问不到，此时就需要让服务在后台运行。

如果使用了 Koa/Express 等 Node.js Web 开发框架，并使用了 Nuxt 作为中间件，可以自定义 Web 服 务器的启动入口：

| 命令                                         | 描述                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| NODE_ENV=development nodemon server/index.js | 启动一个热加载的自定义 Web 服务器（开发模 式）。             |
| NODE_ENV=production node server/index.js     | 以生产模式启动一个自定义 Web 服务器 (需要先执行 nuxt build )。 |

##### 自动化部署

- 传统部署

  麻烦，手动构建并发布

- 现代化部署方式（CI/CD）

  1. 本地将更新代码推送到远程仓库
  2. 将用户更新通知给持续集成/持续部署服务
     - 拉取最新代码到服务当中
     - 编译构建
     - 打包生成release
     - 将release部署到服务器

  ![image-20210321162548934](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210321162548934.png)

##### CI/CD服务

- Jenkins
- Gitlab CI
- GitHub Actions
- Travis CI
- Circle CI
- ...

##### 使用GitHub Action实现自动部署

###### 配置GItHub Access Token

生成：https://github.com/settings/tokens

- github settings --> Developer settings --> Personal access tokens --> Generate new token

- Note --> Select scopes 全选repo，对此仓库操作权限，生成

- 复制token（只显示一次）

  ![image-20210321171700294](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210321171700294.png)

配置到项目的Secrets中：https://

- 指定仓库 settings --> Secrets --> New Secret创建

- Name填写和脚本中的名称要一致，value填入刚生成的token

  ![image-20210321171822794](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210321171822794.png)

###### 配置GitHub Actions执行脚本

- 在项目根目录创建.github/workflows目录

- 在workflows目录中创建main.yml文件

  ```yml
  name: Publish And Deploy Demo
  on:
    push:
      tags:
        - 'v*'
  
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
  
      # 下载源码
      - name: Checkout
        uses: actions/checkout@master
  
      # 打包构建
      - name: Build
        uses: actions/setup-node@master
      - run: npm install
      - run: npm run build
      - run: tar -zcvf release.tgz .nuxt static nuxt.config.js package.json package-lock.json pm2.config.json
  
      # 发布 Release
      - name: Create Release
        id: create_release
        uses: actions/create-release@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
  
      # 上传构建结果到 Release
      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./release.tgz
          asset_name: release.tgz
          asset_content_type: application/x-tgz
  
      # 部署到服务器
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: ${{ secrets.PORT }}
          script: |
            cd /root/realworld-nuxtjs
            wget https://github.com/lipengzhou/realworld-nuxtjs/releases/latest/download/release.tgz -O release.tgz
            tar zxvf release.tgz
            npm install --production
            pm2 reload pm2.config.json
  
  ```

- 修改配置

  添加secrets参数到github对应仓库

  ![image-20210321173115025](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210321173115025.png)

- 配置PM2配置文件

  ```json
  /**
   * pm2配置文件
   * 使用pm2启动服务 名称RealWorld
   * 脚本是npm 参数是start
   * 相当于执行npm start命令
   */
  {
    "apps": [
      {
        "name": "RealWorld",
        "script": "npm",
        "args": "start"
      }
    ]
  }
  ```

- 提交更新

  ```shell
  git add .
  git tag v0.1.0
  git push origin v0.1.0
  ```

- 查看自动部署状态

  Actions页签 --> 发布部署-测试 --> Public And Deploy Demo --> build-and-deploy

- 访问网站

- 提交更新...

