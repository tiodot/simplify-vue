<template>
  <div class="msg" @click="handleClick">
    {{message}}
    <Child @click="handleCompEvent"/>
  </div>
</template>

<script>
import Child from './Child.vue'
export default {
  name: 'App',
  data() {
    return {
      message: '我是一个组件'
    }
  },
  components: {
    Child
  },
  methods: {
    handleClick(evt) {
      console.log('click event', evt.target.tagName)
    },
    handleCompEvent(msg) {
      console.log(msg)
    }
  },
}
</script>

<style>
  .msg {
    font-size: 14px;
    cursor: pointer;
  }
</style>