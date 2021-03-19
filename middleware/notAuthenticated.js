export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  // 如果已登录 跳转到首页
  if (store.state.user) {
    return redirect('/')
  }
}
