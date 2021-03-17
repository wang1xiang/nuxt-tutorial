<template>
  <div>
    <h1>{{ article.title }}</h1>
    <div>{{ article.body }}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'articlePage',
  // context上下文对象
  // $config: {app: {…}}
  // app: {head: {…}, router: VueRouter, nuxt: {…}, render: ƒ, data: ƒ, …}
  // base: "/"
  // env: {}
  // error: ƒ ()
  // from: {name: "index", meta: Array(1), path: "/", hash: "", query: {…}, …}
  // isDev: true
  // isHMR: false
  // isStatic: false
  // next: ƒ ()
  // nuxtState: {layout: "default", data: Array(1), fetch: {…}, error: null, serverRendered: true, …}
  // params: {id: "1"}
  // payload: undefined
  // query: {}
  // redirect: ƒ (status, path, query)
  // route: {name: "article-id", meta: Array(1), path: "/article/1", hash: "", query: {…}, …}
  // _errored: false
  // _redirected: false
  async asyncData (context) {
    console.log(context)
    const { data } = await axios({
      method: 'GET',
      url: 'http://localhost:3000/data.json'
    })
    const id = Number.parseInt(context.params.id)
    return {
      article: data.posts.find(item => item.id === id)
    }
  }
}

</script>
<style>
</style>