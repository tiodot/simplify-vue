import {
  getStyle,
  normalizeStyleBinding,
  isDef,
  isUndef,
  camelize,
} from "../util";

const cssVarRE = /^--/;

function setProp(el, name, val) {
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else {
    const normalizedName = camelize(name);
    console.log('normalizedName', normalizedName)
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
    console.log('el.style', el.style)
  }
}

function updateStyle(oldVnode, vnode) {
  const data = vnode.data;
  const oldData = oldVnode.data;

  if (
    isUndef(data.staticStyle) &&
    isUndef(data.style) &&
    isUndef(oldData.staticStyle) &&
    isUndef(oldData.style)
  ) {
    return;
  }

  let cur, name
  const el = vnode.elm

  const oldStaticStyle = oldData.staticStyle
  const oldStyleBinding = oldData.normalizedStyle || oldData.style || {}

  const oldStyle = oldStaticStyle || oldStyleBinding
  const style = normalizeStyleBinding(vnode.data.style) || {}

  vnode.data.normalizedStyle = isDef(style.__ob__) ? Object.assign({}, style) : style
  
  const newStyle = getStyle(vnode, true)
  console.log(newStyle, 'newStyle')

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '')
    }
  }

  for (name in newStyle) {
    cur = newStyle[name]
    if (cur !== oldStyle[name]) {
      setProp(el, name, cur)
    }
  }
}

export default {
  create: updateStyle,
  update: updateStyle
}
