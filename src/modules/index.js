import className from './class'
import style from './style'

// {create: [], xxx}
const cbs = {
  create: [],
  activate: [],
  update: [],
  remove: [],
  destroy: []
}

const modules = [className, style]

for (let mod of modules) {
  Object.keys(mod).forEach(hookName => {
    cbs[hookName].push(mod[hookName])
  })
}

export default cbs