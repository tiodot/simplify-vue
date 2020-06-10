export const emptyObject = Object.freeze({});

export function isUndef(v) {
  return v === undefined || v === null;
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function isTrue(v) {
  return v === true;
}

export function isPrimitive(value) {
  const valType = typeof value;
  return ["string", "number", "symbol", "boolean"].includes(valType);
}

export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export function noop() {}

export function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(",");
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function(val) {
        return map[val.toLowerCase()];
      }
    : function(val) {
        return map[val];
      };
}

const _toString = Object.prototype.toString;
export function isPlainObject(obj) {
  return _toString.call(obj) === "[object Object]";
}

export function toString(val) {
  return val == null
    ? ""
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val);
}

export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const camelizeRE = /-(\w)/g
export const camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : ''
  })
})

export const capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

const hyphenateRE = /\B(A-Z)/g
export const hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})