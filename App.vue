<template>
  <div class="msg" @click="handleClick">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: '我是一个组件'
    }
  },
  methods: {
    handleClick(evt) {
      console.log('click event....', evt.target.tag)
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