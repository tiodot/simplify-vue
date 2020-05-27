function isDef (v) {
  return v !== undefined && v !== null
}

function createElm(vnode, parentElm, refElm){
  const children = vnode.children
  const tag = vnode.tag

  if (isDef(tag)) {
    vnode.elm = createElement(tag)
    createChildren(vnode, children)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}

function createChildren(vnode, children) {
  if (Array.isArray(children)) {
    for(let child of children) {
      createElm(child, vnode.elm, null)
    }
  } else {
    vnode.elm.appendChild(createTextNode(vnode.text))
  }
}

function insert(parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (ref.parentNode === parent) {
        parent.insertBefore(elm, ref)
      }
    } else {
      parent.appendChild(elm)
    }
  }
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createElement (tagName) {
  return document.createElement(tagName)
}

function nextSibling (node) {
  return node.nextSibling
}
function parentNode (node) {
  return node.parentNode
}

export default function patch(oldVnode, vnode) {
    const oldElm = oldVnode
    const parentElm = parentNode(oldElm)

    createElm(vnode, parentElm, nextSibling(oldElm))

    if (isDef(parentElm)) {
      parentElm.removeChild(oldVnode)
    } 
    return vnode.elm
}