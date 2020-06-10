import {
  isUndef,
  genClassForVnode
} from '../util'

function updateClass(oldVnode, vnode) {
  const el = vnode.elm
  const data = vnode.data

  const oldData = oldVnode.data
  if (isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
  ) {
    return
  }

  let cls = genClassForVnode(vnode)

  if (cls !== el._prevClass) {
    el.setAttribute('class', cls)
    el._prevClass = cls
  }
}

export default {
  create: updateClass,
  update: updateClass
}
