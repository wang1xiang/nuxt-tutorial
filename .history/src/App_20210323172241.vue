<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <ul>
      <li v-for="(item, index) in todos" :key="index">{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
      message: '',
      todos: []
    }
  },
  async mounted () {
    const { data } = await axios({
      method: 'GET',
      url: '/data.json'
    })
    this.message = data.message
    this.todos = data.todos
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
