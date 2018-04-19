'use strict'
const hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = Layer

function Layer(method, fn) {
  this.method = method,      //eg:post,get,delete
  this.handle = fn
}

Layer.prototype.handle_method = function (req) {
  return this.method.toLowerCase() === req.method.toLowerCase()
}

Layer.prototype.handle_request = function(req, res, next) {
  if (!this.handle_method(req)) return
  const fn = this.handle
  try {
    fn(req, res, next)      //真正的处理函数
  } catch (err) {
    throw err
  }
}