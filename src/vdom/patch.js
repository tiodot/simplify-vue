import VNode from './vnode'
import * as NodeOps from './node-ops'
import modules from '../modules'
import {isDef, isUndef, isPrimitive} from '../util'

const emptyNode = new VNode('', {}, [])
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data)
  )
}

function emptyNodeAt(elm) {
  const tag = NodeOps.tagName(elm).toLowerCase()
  return new VNode(tag, {}, [], undefined, elm)
}

function removeNode(el) {
  const parent = NodeOps.parentNode(el)
  if (isDef(parent)) {
    NodeOps.removeChild(parent, el)
  }
}

/**
 * 根据Vnode创建对应的元素并插入到DOM中
 * @param {*} vnode 
 * @param {*} parentElm 
 * @param {*} refElm 
 */
function createElm(vnode, parentElm, refElm){

  if (createComponent(vnode, parentElm, refElm)) {
    return
  }

  const children = vnode.children
  const tag = vnode.tag
  const data =  vnode.data

  if (isDef(tag)) {
    vnode.elm = NodeOps.createElement(tag)
    createChildren(vnode, children)
    if (isDef(data)) {
      invokeCreateHook(vnode)
    }
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = NodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}

function createChildren(vnode, children) {
  if (Array.isArray(children)) {
    for(let child of children) {
      createElm(child, vnode.elm)
    }
  } else if (isPrimitive(vnode.text)) {
    NodeOps.appendChild(vnode.elm, NodeOps.createTextNode(vnode.text))
  }
}

function createComponent (vnode, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false)
    }
    if (isDef(vnode.componentInstance)) {
      vnode.elm = vnode.componentInstance.$el
      insert(parentElm, vnode.elm, refElm)
      return true
    }
  }
}

function insert(parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (NodeOps.parentNode(ref) === parent) {
        NodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      NodeOps.appendChild(parent, elm)
    }
  }
}

function patchVnode(oldVnode, vnode) {
  if (oldVnode === vnode) {
    return
  }
  const elm = (vnode.elm = oldVnode.elm)
  const data = vnode.data

  const oldCh = oldVnode.children
  const ch = vnode.children

  // 针对更新是，触发update的构造
  if (isDef(data) && isPatchable(vnode)) {
    for (let updateCb of modules.update) {
      updateCb(oldVnode, vnode)
    }
  }

  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) {
        // 因为知道单个简单文本，简单渲染
        patchVnode(oldCh[0], ch[0])
      }
    } else { // 此处有些逻辑不严谨
      NodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    NodeOps.setTextContent(elm, vnode.text)
  }
}

function invokeCreateHook(vnode) {
  const createCbs = modules.create
  for (let cb of createCbs) {
    cb(emptyNode, vnode)
  }
}

function isPatchable (vnode) {
  while(vnode.componentInstance) {
    vnode = vnode.componentInstance._vnode
  }
  return isDef(vnode.tag)
}

export default function patch(oldVnode, vnode) {
  // 不需要挂载的组件渲染
  if (isUndef(oldVnode)) {
    createElm(vnode)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode)
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
      }

      const oldElm = oldVnode.elm
      const parentElm = NodeOps.parentNode(oldElm)

      // 通过VNode创建DOM元素，需要递归创建子元素
      createElm(vnode, parentElm, NodeOps.nextSibling(oldElm))

      if (isDef(parentElm)) {
        // 移除挂载的dom节点
        removeNode(oldVnode.elm)
      }
    }
  }
  return vnode.elm
}