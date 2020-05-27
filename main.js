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