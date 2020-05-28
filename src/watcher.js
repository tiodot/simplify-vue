import { noop, nextTick } from "./util.js";
import { pushTarget, popTarget } from "./dep";

let uid = 0;

export default class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    this.id = ++uid

    this.expression = fn.toString()

    this.getter = fn || noop
    this.value = this.get()
  }

  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } finally {
      popTarget()
    }
    return value
  }

  update() {
    queueWatcher(this)
  }

  run() {
    this.get()
  }
}

let has = {}
const queue = []

function queueWatcher (watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)
  }
  nextTick(flushSchedulerQueue)
}

function flushSchedulerQueue() {
  for (let index = 0; index < queue.length; index++) {
    let watcher = queue[index]
    has[watcher.id] = null
    watcher.run()
  }

  queue.length  = 0
  has = {}
}