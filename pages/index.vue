<template>
  <div>
    <h1>{{ title }}</h1>
    <nuxt-link to="/about">About</nuxt-link>
    <foo :posts="posts"></foo>
  </div>
</template>

<script>
// 路由规则 自动扫描pages目录，将里面的组件自动提取为路由配置
import axios from 'axios'
import Foo from '@/components/Foo'

export default {
  name: 'HomePage',
  components: {
    Foo
  },
  // 当你想要动态页面内容有利于 SEO 或者是提升首屏渲染速度的时候，就在 asyncData 中发请求拿数据
  // 注意事项：1.只能在页面组件中使用，子组件中可通过props获取父组件异步数据 2.没有this，在组件初始化之前被调用
  // 调用时机：1.获取服务端渲染数据（确保异步数据在渲染到客户端之前已经填充渲染完成，提高渲染速度，有利于SEO） 2.客户端路由更新之前也会被调用
  async asyncData () {
    // 此行输出在服务端执行
    // 在浏览器也会输出 包裹在Nuxt SSR中
    console.log('async Data')
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/data.json'
    })
    // 返回的对象可以直接在页面组件使用
    // 在vue调试工具中有了posts和title
    // asyncData返回的数据会和data中的混合
    return res.data
  },

  // 如果是非异步数据或者普通数据，则正常的初始化到 data 中即可
  data () {
    return {
      foo: 'bar'
    }
  }
}

</script>
<style>
</style>