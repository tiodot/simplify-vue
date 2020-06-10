<template>
  <div class="msg" :class="className" :style="styleObj">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: '我是一个组件',
      className: 'test',
      styleObj: {
        color: '#f00'
      }
    }
  }
}
</script>

<style>
  .msg {
    font-size: 14px;
  }
  .test {
    background: rebeccapurple;
  }
  .t1 {
    background: rosybrown;
  }
</style>