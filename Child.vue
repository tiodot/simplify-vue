<template>
  <div class="child" @click="handleClick">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'Child',
  data() {
    return {
      message: '我是一个子组件'
    }
  },
  mounted() {
    setTimeout(() => {
      this.$emit('click', '自动触发子组件点击')
    }, 1000)
  },
}
</script>

<style>
  .child {
    background: #dedede;
  }
</style>