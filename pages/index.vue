<template>
  <div>
    <h1>hello nuxt.js</h1>
  </div>
</template>

<script>
// 路由规则 自动扫描pages目录，将里面的组件自动提取为路由配置
export default {
  name: 'HomePage',
  layout: 'foo',
  // 默认 layout设置自定义的布局组件 未设置的路由还会走默认的布局组件
  // layout: 'default'
}

</script>
<style>
</style>