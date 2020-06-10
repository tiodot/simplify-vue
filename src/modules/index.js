import className from './class'

// {create: [], xxx}
const cbs = {
  create: [],
  activate: [],
  update: [],
  remove: [],
  destroy: []
}

const modules = [className]

for (let mod of modules) {
  Object.keys(mod).forEach(hookName => {
    cbs[hookName].push(mod[hookName])
  })
}

export default cbs