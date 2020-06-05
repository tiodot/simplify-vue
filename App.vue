<template>
  <div>
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
  beforeCreate() {
    console.log('[hook]: beforeCreate')
  },
  created() {
    console.log('[hook]: created')
  },
  beforeMount() {
    console.log('[hook]: beforeMount')
  },
  mounted() {
    console.log('[hook]: mounted')
  },
  beforeUpdate() {
    console.log('[hook]: beforeUpdate')
  },
  updated() {
    console.log('[hook]: updated')
  },
}
</script>