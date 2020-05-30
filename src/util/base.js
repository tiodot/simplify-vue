export const emptyObject = Object.freeze({})

export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isTrue (v) {
  return v === true
}

export function isPrimitive (value) {
  const valType = typeof value
  return ['string', 'number', 'symbol', 'boolean'].includes(valType)
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function noop () {}