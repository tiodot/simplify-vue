import { noop, nextTick } from "../util";
import { pushTarget, popTarget } from "./dep";
import {callHook} from '../instance/lifecycle'

let uid = 0;

export default class Watcher {
  constructor(vm, fn, options = {}) {
    this.vm = vm
    this.id = ++uid

    this.expression = fn.toString()

    this.getter = fn || noop
    this.value = this.get()
    this.before = options.before
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
    if (watcher.before) {
      watcher.before()
    }
    watcher.run()
  }

  callUpdatedHooks(queue)

  queue.length  = 0
  has = {}
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while(i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}