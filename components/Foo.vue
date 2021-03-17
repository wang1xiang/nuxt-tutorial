<template>
  <div>
    <h1>FooPage</h1>
    <!-- Property or method "foo" is not defined on the instance but referenced during render -->
    <!-- <p>{{ foo }}</p> -->
    <ul>
      <li v-for="item in posts" :key="item.id">{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Foo',
  // 组件中不能使用asyncData 通过props获取父组件执行
  props: ['posts'],
  async asyncData () {
    return {
      foo: 'bar'
    }
  }
}

</script>
<style>
</style>