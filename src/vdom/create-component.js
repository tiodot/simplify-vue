import VNode from './vnode'
import {activeInstance} from '../instance/lifecycle'

const componentVNodeHooks = {
  init(vnode, hydrating) {
    const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance)
    child.$mount(hydrating ? vnode.$el : undefined, hydrating)
  }
}

export function createComponent(options, data = {}, context, children) {
  installComponentHooks(data)

  return new VNode(
    `vue-component${options.name ? '-'+ options.name : ''}`,
    data, undefined, undefined, undefined, context,
    {
      Ctor: context.constructor,
      options,
      propsData: {},
      children
    }
  )
}

function createComponentInstanceForVnode(vnode, parent) {
  const options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
    ...vnode.componentOptions.options
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks(data) {
  const hooks = data.hook || (data.hook = {})

  for (let key of Object.keys(componentVNodeHooks)) {
    hooks[key] = componentVNodeHooks[key]
  }
}