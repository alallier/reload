var reload = require('../lib/reload.js')
var http = require('http')
var path = require('path')
var assert = require('assert')

describe('reload',function(){
  it('serves-and-closes',function(done){
    var config = null
    var servePath = path.join(__dirname,'../','expressSampleApp','public')
    reload(servePath,{port:3030, open:false, log:function(){}})
    .then(function(setup){
      config = setup
      return promiseRequest({host:'localhost', port:'3030', path:'/index2.html'})
    })
    .then(function(res){
      assert(res.statusCode, 404)
      assert(res.statusMessage, 'Not Found')
    })
    .then(function(){
      return promiseRequest({host:'localhost', port:'3030', path:'/index.html'})
    })
    .then(function(response){
      assert(response.statusCode, 200)
      assert(response.statusMessage, 'OK')
      
      response.setEncoding('utf8');
      return new Promise(function(res,rej){
        response.on('data', function (chunk) {
          res(chunk)
        })
      })
    })
    .then(function(body){
      assert.equal(body.search(/reload\/reload\.js/)>=0, true)
    })
    .then(function(){
      config.httpServer.close(done)
    })
    .catch(done)
  })
})

function promiseRequest(){
  var args = arguments
  return new Promise(function(res,rej){
    args[args.length++] = function(response){
      res(response)
    }
    http.request.apply(http,args).end()
  })
}