<template>
  <div>
    <h1>{{ message }}</h1>
    <ul>
      <li v-for="(item, index) in todos" :key="index">{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HomePage',
  async asyncData () {
    const { data } = await axios.get('http://localhost:3000/data.json')
    const message = data.message
    const todos = data.todos
    return {
      message, todos
    }
  }
}

</script>
<style>
</style>