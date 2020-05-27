

export function noop () {}

export function isFunc(fn) {return typeof fn === 'function'}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target, sourceKey, key, custom = {}) {
  sharedPropertyDefinition.get = custom.get || function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = custom.set || function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

/**
 * Remove an item from an array.
 */
export function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    return selected ? selected : document.createComment('div')
  } else {
    return el
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}


// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isTrue (v) {
  return v === true
}

export function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString;

export function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
export function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

export function toArray (val, forceArray) {
  if (!val) return forceArray ? [] : val
  return Array.isArray(val) ? val : [val]
}

// lang 相关的util
export const unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD'

/**
 * Check if a string starts with $ or _
 */
export function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
const bailRE = new RegExp(("[^" + unicodeLetters + ".$_\\d]"));
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}


const callbacks = [];
let pending = false;

export function nextTick (cb, ctx) {
  callbacks.push(function () {
    if (cb) {
      cb.call(ctx)
    } else {
      Promise.resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    Promise.resolve().then(() => {
      pending = false;
      const copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    })
  }
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
export const camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options,
  type,
  id,
) {
  const assets = options[type];
  if (!assets) return
  if (hasOwn(assets, id)) { return assets[id] }
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  const PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  return assets[id] || assets[camelizedId] || assets[PascalCaseId];
}

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cached(function(str) {
  return str.replace(hyphenateRE, "-$1").toLowerCase();
})

export function todo(fnName) {
  return function () {
    console.log('函数待完成', fnName)
  }
}