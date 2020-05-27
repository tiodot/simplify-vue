import VNode, {cloneVNode} from './vnode'
import * as NodeOps from '../runtime/node-ops'
import {isDef, isUndef, isTrue, isPrimitive} from '../util/base'

export const emptyNode = new VNode('', {}, {})


function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data)
  )
}

function emptyNodeAt(elm) {
  return new VNode(NodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
}

function removeNode(el) {
  const parent = NodeOps.parentNode(el)
  if (isDef(parent)) {
    NodeOps.removeChild(parent, el)
  }
}

function removeNodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      removeNode(ch.elm)
    }
  }
}

function createElm(vnode, insertedVnodeQueue, parentElm, refElm){
  // const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag

  if (isDef(tag)) {
    vnode.elm = NodeOps.createElement(tag)
    createChildren(vnode, children, insertedVnodeQueue)
    // TODO: 使用其他modules
    insert(parentElm, vnode.elm, refElm)
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = NodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = NodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}

function createChildren(vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for(let child of children) {
      createElm(child, insertedVnodeQueue, vnode.elm, null)
    }
  } else if (isPrimitive(vnode.text)) {
    NodeOps.appendChild(vnode.elm, NodeOps.createTextNode(vnode.text))
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

function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
 // TODO:
}



export default function patch(oldVnode, vnode) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) {
      console.log('组件销毁')
    }
  }
  const insertedVnodeQueue = []
  // 不需要挂载的组件渲染
  if (isUndef(oldVnode)) {
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
      }
    }

    const oldElm = oldVnode.elm
    const parentElm = NodeOps.parentNode(oldElm)

    createElm(vnode, insertedVnodeQueue, parentElm, NodeOps.nextSibling(oldElm))
    
    if (isDef(parentElm)) {
      removeNodes(parentElm, [oldVnode], 0, 0)
    } else if (isDef(oldVnode.tag)) {
      // invokeDestroyHook(oldVnode)
    }
    // invokeInsertHook
    return vnode.elm
  }
}