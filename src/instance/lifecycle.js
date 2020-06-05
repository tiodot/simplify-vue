

export let activeInstance = null

export function setActiveInstance(vm) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return function () {
    activeInstance = prevActiveInstance
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let handler of handlers) {
      handler.call(vm, vm)
    }
  }
}