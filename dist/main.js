/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/vnode.js


class VNode {
  constructor(tag, data, children, text) {
    this.tag = tag
    this.data = data
    // 处理一下文本的情况
    this.children = isPrimitive(children) ? [createTextVNode(children)] : children
    this.text = text
  }
}

function createTextVNode (text) {
  return new VNode(undefined, undefined, undefined, String(text))
}

function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
// CONCATENATED MODULE: ./src/patch.js
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

function patch(oldVnode, vnode) {
    const oldElm = oldVnode
    const parentElm = parentNode(oldElm)

    createElm(vnode, parentElm, nextSibling(oldElm))

    if (isDef(parentElm)) {
      parentElm.removeChild(oldVnode)
    } 
    return vnode.elm
}
// CONCATENATED MODULE: ./src/vue.js




class vue_Vue {
  constructor(options) {
    // 需要渲染一个简单的data属性
    this.$options = options

    this.$createElement = (tag, data, children) => new VNode(tag, data, children)

    this.initData()

    if (this.$options.el) {
      this.$mount(this.$options.el)
    }

  }
  initData() {
    let data = this.$options.data
    data = this._data = typeof data === 'function' ? data.call(this, this) : (data || {})
    const keys = Object.keys(data)
    for (let key of keys) {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: function () { return this._data[key]},
        set: function (val) { this._data[key] = val}
      })
    }
  }

  // 组件更新
  _update(vnode) {
    this.$el = patch(this.$el, vnode)

    if (this.$el) {
      this.$el.__vue__ = this
    }
  }
  _render() {
    const render = this.$options.render
    // 返回 vnode
    return render.call(this, this.$createElement)
  }

  $mount(el) {
    this.$el = el = document.querySelector(el)
    this._update(this._render())
    return this
  }
}
// CONCATENATED MODULE: ./main.js


new vue_Vue({
  el: '#app',
  data() {
    return {
      message: '简单文本渲染'
    }
  },
  render(h) {
    return h('div', null, this.message)
  },
})

/***/ })
/******/ ]);