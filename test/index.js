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
      assert.equal(typeof setup, 'object')
      assert.equal(typeof setup.httpServer, 'object')
      assert.equal(typeof setup.reload, 'function')
      assert.equal(typeof setup.port, 'number')
      
      config = setup
    })

    //request missing index2.html
    .then(function(){
      return promiseRequest({host:'localhost', port:'3030', path:'/index2.html'})
    })
    .then(function(res){
      assert.equal(res.statusCode, 404)
      assert.equal(res.statusMessage, 'Not Found')
    })

    //request index and then test response body
    .then(function(){
      return promiseRequest({host:'localhost', port:'3030', path:'/index.html'})
    })
    .then(function(response){
      assert.equal(response.statusCode, 200)
      assert.equal(response.statusMessage, 'OK')
      
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

    //request client-reload script and then test response body
    .then(function(){
      return promiseRequest({host:'localhost', port:'3030', path:'/reload/reload.js'})
    })
    .then(function(response){
      assert.equal(response.statusCode, 200)
      assert.equal(response.statusMessage, 'OK')
      
      response.setEncoding('utf8');
      return new Promise(function(res,rej){
        response.on('data', function (chunk) {
          res(chunk)
        })
      })
    })
    .then(function(body){
      assert.equal(body.search(/Reload/)>=0, true)
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