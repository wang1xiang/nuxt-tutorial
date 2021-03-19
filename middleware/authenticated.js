/**
 * 每一个中间件需要放置在middleware/目录，文件名就是中间件名称authenticated中间件
 * param：context上下文对象
 * 中间件执行流程：
 * 1.nuxt.config.js
 * 2.匹配布局
 * 3.匹配页面
 * 验证是否登录的中间件
 */
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user) {
    return redirect('/login')
  }
}
