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
    console.log('[App.vue hook]: beforeCreate')
  },
  created() {
    console.log('[App.vue hook]: created')
  },
  beforeMount() {
    console.log('[App.vue hook]: beforeMount')
  },
  mounted() {
    console.log('[App.vue hook]: mounted')
  },
  beforeUpdate() {
    console.log('[App.vue hook]: beforeUpdate')
  },
  updated() {
    console.log('[App.vue hook]: updated')
  },
}
</script>