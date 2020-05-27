import {
  camelize,
  isPlainObject,
  hasOwn,
  isFunc,
  toArray,
  hyphenate
} from './base'
import {set, observe} from '../observer/index'
// import {LIFECYCLE_HOOKS, ASSET_TYPES} from '../constants'

const strategies = Object.create(null)


/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = Object.keys(from)

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    // 不覆盖同名属性值
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strategies.data = function (parentVal, childVal, vm) {
  if (!vm && !isFunc(childVal)) {
    // data 需要是函数形式
    return parentVal
  }
  return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * Hooks and props are merged as arrays.
 */

function mergeHook (parentVal, childVal) {
  let res = parentVal
  if (childVal) {
    res = toArray(childVal)
    if (parentVal) {
      // 合并去重
      res = [...new Set(parentVal.concat(res))]
    }
  }
  return res
}

// LIFECYCLE_HOOKS.forEach(hook => {
//   strategies[hook] = mergeHook
// })

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  const res = Object.create(parentVal || null)
  if (childVal) {
    return Object.assign(res, childVal)
  }
  return res
}

// ASSET_TYPES.forEach(type => {
//   strategies[type] = mergeAssets
// })

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strategies.watch = function (parentVal, childVal) {
  if (!parentVal) return childVal
  if (!childVal) return parentVal
  const merged = {...parentVal}
  Object.keys(childVal).forEach(key => {
    // 如果不存在则赋值一个空数组
    merged[key] = toArray(merged[key], true)
    // 合并一下数据
    merged[key].concat(toArray[childVal[key]])
  })
  return merged
}

strategies.props = 
strategies.methods = 
strategies.computed = function (parentVal, childVal) {
  if (!parentVal) return childVal
  const ret = {...parentVal}
  if (childVal) {
    Object.assign(ret, childVal)
  }
  return ret
}

strategies.default = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
// 支持形式 props: ['a', 'b'] === {a: {type: null}, b: {type: null}}
//         props: {a: 'String', b: {type: 'String'}} === {a: {type: 'String'}, b: {type: 'String'}}
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } 
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions ( parent, child, vm) {
  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strategy = strategies[key] || strategies.default;
    options[key] = strategy(parent[key], child[key], vm);
  }
  return options
}


function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

function isSameType(a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (let i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) return i
  }
  return -1
}

function getPropDefaultValue(vm, prop, key) {
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  const def = prop.default
  if (
    vm && 
    vm.$options.propsData && 
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

export function validateProp(key, propOptions, propsData, vm) {
  const prop = propOptions[key]
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // boolean
  const booleanIndex = getTypeIndex(Boolean, prop.type)
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      const stringIndex = getTypeIndex(String, prop.type)
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true
      }
    }
  }

  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    observe(value)
  }
  return value
}