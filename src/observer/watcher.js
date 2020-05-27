import { isFunc, noop, parsePath, isObject, remove, nextTick } from "../util/base";
import { pushTarget, popTarget } from "./dep";
import VNode from '../vdom/vnode'
let uid = 0;

export default class Watcher {
  constructor(vm, expOrFn, cb, options = {}) {
    this.vm = vm;

    vm._watchers.push(this);
    const { deep, user, lazy, sync, before } = options;
    this.deep = !!deep;
    this.user = !!user;
    this.lazy = !!lazy;
    this.sync = !!sync;
    this.before = before;

    this.cb = cb;
    this.id = ++uid;
    this.active = true;
    this.dirty = this.lazy;
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression = expOrFn.toString();

    if (isFunc(expOrFn)) {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn) || noop;
    }

    this.value = this.lazy ? undefined : this.get();
  }

  get() {
    // 所以 watcher 其实就是 Vue 实例和属性双向绑定的一个桥梁？
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } finally {
      if (this.deep) {
        traverse(value); // 通过traverse 读取值，触发 Observer 收集到当前watcher
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }

  addDep(dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this); // dep 关注的是
      }
    }
  }

  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();

    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  }

  update() {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      // 加入队列
      queueWatcher(this);
    }
  }

  run() {
    if (this.active) {
      // 执行update函数， 这里会触发 _update
      const value = this.get();
      if (value !== this.value || isObject(value) || this.deep) {
        const oldValue = this.value;
        this.value = value;

        this.cb.call(this.vm, value, oldValue);
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }

  teardown() {
    if (this.active) {
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }

      let i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  }
}

/**
 * 递归遍历值，方便收集
 * @param {any} value 对象或者普通的值 
 */
function traverse(value) {
  const seenObject = new Set();
  _traverse(value, seenObject);
  seenObject.clear();
}

function _traverse(val, seen) {
  if (!isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }

  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) return;
    seen.add(depId);
  }
  if (Array.isArray(val)) {
    let i = val.length;
    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    const keys = Object.keys(val);
    let i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

let has = {}
let flushing = false
let waiting = false
const queue = []
const activatedChildren = [];
let index = 0

function queueWatcher (watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while(i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
  }
  if (!waiting) {
    waiting = true
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue() {
  flushing = true

  queue.sort(function(a, b) {return a.id - b.id})

  for (index = 0; index < queue.length; index++) {
    let watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    has[watcher.id] = null
    watcher.run()
  }

  const updatedQueue = queue.slice()
  
  resetSchedulerState()
  
  callUpdatedHooks(updatedQueue)
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      vm.callHook('updated')
    }
  }
}

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  waiting = flushing = false
}