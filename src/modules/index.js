import className from './class'
import style from './style'
import event from './event'

// {create: [], xxx}
const cbs = {
  create: [],
  activate: [],
  update: [],
  remove: [],
  destroy: []
}

const modules = [className, style, event]

for (let mod of modules) {
  Object.keys(mod).forEach(hookName => {
    cbs[hookName].push(mod[hookName])
  })
}

export default cbs