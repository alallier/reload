var reload = require('../lib/reload.js')
var http = require('http')
var assert = require('assert')

describe('reload',function(){
  it('serves-and-closes',function(done){
    reload(__dirname,{port:3030, open:false, log:function(){}})
    .then(function(config){
      var req = http.request({host:'localhost', port:'3030', path:'/index2.html'},function(res){
        assert(res.statusCode, 404)
        assert(res.statusMessage, 'Not Found')
        config.httpServer.close(done)
      })
      req.end()
    })
  })
})