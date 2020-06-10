import App from './App.vue'
import Vue from './vue.simplify'
// import Vue from './src/vue'

new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
})