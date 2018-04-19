'use strict'
const flatten = require('array-flatten')
const Layer = require('./layer')
const methods = require('methods')

const slice = Array.prototype.slice

module.exports = Route

function Route () {
  this.stack = []
  this.methods = {}
}

Route.prototype._handle_method = function (method) {
  const name = method.toLowerCase()
  return Boolean(this.methods[name])
}

Route.prototype.dispatch = function (req, res) {
  //1.获取请求方法，例如 get.
  const method = req.method.toLowerCase()
  const stack = this.stack
  let idx = 0
  next()
  function next () {
    const layer = stack[idx++]
      //如果 layer.method != get 直接跳到下一个 stack[idx],即下一个layer
    if (layer.method && layer.method !== method) {
      return next()
    }
    //找到 layer.get 后，处理请求,处理完后执行 next(),指导stack中的layer全部循环完毕。
    layer.handle_request(req, res, next)
  }
}

/**
 *
 * 给 Router 添加方法
 */
methods.forEach(function (method) {
  Route.prototype[method] = function () {
    //将参数扁平化:[f1,f2,[f3,f4]]  => [f1,f2,f3,f4]
    const handles = flatten(slice.call(arguments))
    for (let i = 0; i < handles.length; i++) {
      const layer = new Layer(method, handles[i])
      this.methods[method] = true
      this.stack.push(layer)
    }
  }
})
