// nuxt配置模块
module.exports = {
  router: {
    // http://localhost:3000/app/ 
    base: '/app/',
    // 扩展路由配置
    // routes 一个数组，路由配置表
    // resolve：解析路由组件路径
    extendRoutes (routes, resolve) {
      routes.push({
        // name: 'custom',
        // path: '*',
        // component: resolve(__dirname, 'pages/404.vue')
        path: '/hello',
        name: 'hello',
        component: resolve(__dirname, 'pages/about.vue')
      })
    }
  }
}