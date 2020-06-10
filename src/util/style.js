import {cached, toObject} from './base'


/**
 * 用于解析 css 的字符串 eg:
 *  font-size: 12px; font-color: #fff;
 */
export const parseStyleText = cached(function (cssText) {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return res
})

function normalizeStyleData(data) {
  const style = normalizeStyleBinding(data.style)

  return data.staticStyle ? Object.assign(data.staticStyle, style) : style
}

export function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * 
 * @param {*} vnode 
 * @param {*} checkChild 
 */
export function getStyle (vnode, checkChild) {
  const res = {}
  let styleData

  if (checkChild) {
    let childNode = vnode
    while(childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode
      if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        Object.assign(res, styleData)
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    Object.assign(res, styleData)
  }
  return res
}