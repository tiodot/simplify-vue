<template>
  <div class="msg" :class="className">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: '我是一个组件',
      className: 'test'
    }
  }
}
</script>

<style>
  .msg {
    font-size: 14px;
    font-weight: bold;
  }
  .test {
    background: rebeccapurple;
  }
  .t1 {
    background: rosybrown;
  }
</style>