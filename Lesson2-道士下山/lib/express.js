const http = require('http')
const mixin = require('merge-descriptors')
const methods = require('methods');
const Layer = require('./router/layer.js')

module.exports = function createServer() {
  const app = function (req, res) {
    app.handle(req, res)
  }
  mixin(app, proto, false)
  app.init()
  return app
}

const proto = Object.create(null)
proto.listen = function (port) {
  const server = http.createServer(this)
  return server.listen.apply(server, arguments)
}

proto.init = function () {
  this.handles = []
}

/**
 * 当请求来时，遍历 handles 数组，
 * eg: 假设发来的是 get请求 则只有 handles.get会执行，其他的直接return

 */
proto.handle = function (req, res) {
  // 对handles中的函数进行遍历
  for (let i = 0; i < this.handles.length; i++) {
    const layer = this.handles[i]
    layer.handle_request(req, res)
  }
}
/**
 * 1。methods：一个函数名称数组 [get,post,delete,。。。。]；
 * 2。把[get,post,delete,。。]的每一个制作为一个 Layer对象，并放进handles
 */
methods.forEach(function(method) {
  proto[method] = function(fn) {
    const layer = new Layer(method, fn)
    this.handles.push(layer)
  }
})