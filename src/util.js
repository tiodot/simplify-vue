

export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function noop() {}

export function isTrue (v) {
  return v === true
}

export function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

const callbacks = [];
let pending = false;

export function nextTick (cb, ctx) {
  callbacks.push(function () {
    if (cb) {
      cb.call(ctx)
    } else {
      Promise.resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    Promise.resolve().then(() => {
      pending = false
      const copies = callbacks.slice(0);
      callbacks.length = 0
      for (var i = 0; i < copies.length; i++) {
        copies[i]()
      }
    })
  }
}