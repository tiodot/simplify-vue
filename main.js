// import App from './App.vue'
// import './index.css'
// new Vue({
//   el: '#app',
//   render(h) {
//     return h(App)
//   }
// })
// import Vue from './vue.simplify'
import Vue from './src/vue'

new Vue({
  el: '#app',
  data() {
    return {
      message: 'hello'
    }
  },
  render(h) {
    return h('div', {}, this.message)
  },
})