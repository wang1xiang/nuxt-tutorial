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
  },
  // 注册插件
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js',
  ]
}