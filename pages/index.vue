<template>
  <div>
    <h1>hello nuxt.js</h1>
    <br>
    <foo :posts="posts" />
  </div>
</template>

<script>
import axios from 'axios'
import Foo from '@/components/Foo'

// 路由规则 自动扫描pages目录，将里面的组件自动提取为路由配置
export default {
  name: 'HomePage',
  components: {
    Foo
  },
  async asyncData () {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/data.json'
    })
    return res.data
  }
}

</script>
<style>
</style>