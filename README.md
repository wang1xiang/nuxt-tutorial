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

- 为了速度快，在本地起了一套[node+express实现的](https://github.com/gothinkster/node-express-realworld-example-app)

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

  创建middleware文件夹，添加authenticated.js和notAuthenticated.js文件

  

- 

