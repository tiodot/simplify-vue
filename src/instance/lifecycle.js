

export let activeInstance = null

export function setActiveInstance(vm) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return function () {
    activeInstance = prevActiveInstance
  }
}

