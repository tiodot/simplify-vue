import App from './App.vue'
// import Vue from './vue.simplify'
import Vue from './src/vue'

new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
  beforeCreate() {
    console.log('[main.js hook]: beforeCreate')
  },
  created() {
    console.log('[main.js hook]: created')
  },
  beforeMount() {
    console.log('[main.js hook]: beforeMount')
  },
  mounted() {
    console.log('[main.js hook]: mounted')
  },
  beforeUpdate() {
    console.log('[main.js hook]: beforeUpdate')
  },
  updated() {
    console.log('[main.js hook]: updated')
  },
})