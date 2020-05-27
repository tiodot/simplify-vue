import VNode from './vnode'
import * as NodeOps from '../runtime/node-ops'
import {isDef, isUndef, isTrue, isPrimitive, todo} from '../util/base'

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

function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  // let oldKeyToIdx, idxInOld, vnodeToMove, refElm
  const canMove = !removeOnly
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // move right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      canMove && NodeOps.insertBefore(parentElm, oldStartVnode.elm, NodeOps.nextSibling(oldEndVnode.elm))
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // move left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      canMove && NodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
    } else {
      // 没有可以复用的节点 TODO:
    }
  }
}

function addVnodes() {
  todo('addVnodes')()
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
  if (oldVnode === vnode) {
    return;
  }
  const elm = (vnode.elm = oldVnode.elm)

  const data = vnode.data
  const oldCh = oldVnode.children
  const ch = vnode.children

  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) {
        updateChildren(elm, oldCh, ch, insertedVnodeQueue)
      }
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) { // 更新文本
        NodeOps.setTextContent(elm, '')
      }
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeNodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      NodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    NodeOps.setTextContent(elm, vnode.text)
  }
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

      const oldElm = oldVnode.elm
      const parentElm = NodeOps.parentNode(oldElm)

      createElm(vnode, insertedVnodeQueue, parentElm, NodeOps.nextSibling(oldElm))

      if (isDef(parentElm)) {
        removeNodes(parentElm, [oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        // invokeDestroyHook(oldVnode)
      }
    }
    // invokeInsertHook
    return vnode.elm
  }
}