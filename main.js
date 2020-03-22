import Vue from './vue.simplify'
import App from './App.vue'
import './index.css'
new Vue({
  el: '#app',
  render(h) {
    return h(App)
  }
})