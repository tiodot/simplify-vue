import {remove} from './util.js'

let uid = 0
export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    // 判重
    if (this.subs.includes(sub)) return
    this.subs.push(sub) // sub 是 Watcher 的实例
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }

  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
const targetStack = []
export function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}