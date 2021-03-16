<template>
  <div>
    <h1>auout page</h1>
    <!--
      about 跳回首页
      1.a链接方式，刷新导航，走服务端渲染
    -->
    <h2>a链接</h2>
    <a href="/">首页</a>
    <!-- 2.router-link 导航链接组件 -->
    <h2>router-link</h2>
    <router-link to="/">首页</router-link>
    <!-- 3.编程式导航 -->
    <h2>编程式导航</h2>
    <button @click="onClick">首页</button>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  methods: {
    onClick () {
      this.$router.push('/')
    }
  }
}

</script>
<style>
</style>