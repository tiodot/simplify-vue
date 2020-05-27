# 实现一个精简版的Vue2

目标，实现一个精简版本的Vue2，纪念使用Vue2的哪些旧时光


# 开发

本地开发： npm start
编译： npm run build

# 功能
支持简单的文档渲染, 主要是完成渲染流程：

1. Vue实例化
2. 渲染步骤：new Vue -> mount -> _render(生成VNode) -> _update -> patch -> dom

相关Vue内容：
1. data 属性代理： 一般我们定义data都是一个函数，或者对象，Vue是如何实现可以直接从 实例上面取属性的
2. 真实dom元素和Vue实例的关联，可以通过 `dom.__vue__` 访问对应的组件实例

相关概念：
1. VNode： 使用js的对象描述一个 DOM节点
2. patch： 由VNode生成真实DOM节点的过程描述