/* global it, describe */ // npm standard ignore for describe and it

var net = require('net')

describe('API', function () {
  var assert = require('assert')

  it('Should throw if argument length is 0', function (done) {
    var reload = require('../index')
    var threwError = false

    try {
      reload()
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Lack of/invalid arguments provided to reload') {
        threwError = true
        assert(true)
      }
    }

    if (!threwError) {
      assert(false)
    }

    done()
  })

  it('Should throw if first argument is not of type object or function', function (done) {
    var reload = require('../index')
    var threwError = false

    try {
      reload('')
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Lack of/invalid arguments provided to reload') {
        threwError = true
        assert(true)
      }
    }

    if (!threwError) {
      assert(false)
    }

    done()
  })

  it('Should not throw if first argument is of type object', function (done) {
    var reload = require('../index')
    var threwError = false

    try {
      reload({})
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Lack of/invalid arguments provided to reload') {
        threwError = true
        assert(false)
      }
    }

    if (!threwError) {
      assert(true)
    }

    done()
  })

  it('Should not throw if first argument is of type function', function (done) {
    var reload = require('../index')
    var threwError = false

    try {
      reload(function () {})
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Lack of/invalid arguments provided to reload') {
        threwError = true
        assert(false)
      }
    }

    if (!threwError) {
      assert(true)
    }

    done()
  })

  it('Should support legacy (v1.x) arguments reload(server, app)', function (done) {
    var http = require('http')
    var express = require('express')
    var app = express()
    var reload = require('../index')

    var server = http.createServer(app)

    var reloadReturned = reload(server, app)

    closeReloadSocket(reloadReturned, done)
  })

  it('Should return public object', function (done) {
    var express = require('express')
    var app = express()
    var reload = require('../index')

    var reloadReturned = reload(app)

    assert.equal(typeof (reloadReturned.reload), 'function')
    assert.equal(typeof (reloadReturned.startWebSocketServer), 'function')
    assert.equal(typeof (reloadReturned.closeServer), 'function')

    closeReloadSocket(reloadReturned, done)
  })

  it('Should return private object (private, command line only)', function (done) {
    var http = require('http')
    var express = require('express')
    var app = express()
    var reload = require('../lib/reload')

    var server = http.createServer(app)

    var reloadReturned = reload(app, {}, server)

    assert.equal(typeof (reloadReturned.reload), 'function')
    assert.equal(typeof (reloadReturned.reloadClientCode), 'function')
    assert.equal(typeof (reloadReturned.startWebSocketServer), 'function')
    assert.equal(typeof (reloadReturned.closeServer), 'function')

    closeReloadSocket(reloadReturned, done)
  })

  it('Should create (default) `/reload/reload.js` route for reload file', function (done) {
    // console.log(require.cache)
    var http = require('http')
    var express = require('express')
    var app = express()

    var reload = require('../index')
    var reloadReturned = reload(app)

    var server = http.createServer(app)

    server.listen(8080, function () {
      http.get({
        host: 'localhost',
        path: '/reload/reload.js',
        port: 8080
      }, function (response) {
        assert.equal(response.statusCode, 200)
        server.close(function () {
          closeReloadSocket(reloadReturned, done)
        })
      })
    })
  })

  it('Should create (custom) `/something/reload.js` route for reload file', function (done) {
    var http = require('http')
    var express = require('express')
    var app = express()

    var reload = require('../index')
    var reloadReturned = reload(app, {route: '/something', port: 9857})

    var server = http.createServer(app)

    server.listen(8080, function () {
      http.get({
        host: 'localhost',
        path: '/something/reload.js',
        port: 8080
      }, function (response) {
        assert.equal(response.statusCode, 200)
        server.close(function () {
          closeReloadSocket(reloadReturned, done)
        })
      })
    })
  })

  it('Should create WebSocket on default port', function (done) {
    var express = require('express')
    var app = express()

    var reload = require('../index')
    var reloadReturned = reload(app)

    var client = new net.Socket()

    client.connect(9856, '127.0.0.1', function () {
      assert(true)
      client.destroy()
      closeReloadSocket(reloadReturned, done)
    })

    client.on('error', function (err) {
      if (err) {}
      assert(false)
      client.destroy()
      closeReloadSocket(reloadReturned, done)
    })
  })

  it('Should create WebSocket on custom port', function (done) {
    var express = require('express')
    var app = express()

    var reload = require('../index')
    var reloadReturned = reload(app, {port: 9000})

    var client = new net.Socket()

    client.connect(9000, '127.0.0.1', function () {
      assert(true)
      client.destroy()
      closeReloadSocket(reloadReturned, done)
    })

    client.on('error', function (err) {
      if (err) {}
      assert(false)
      client.destroy()
      closeReloadSocket(reloadReturned, done)
    })
  })

  it('Should make WebSocket server start wait with webSocketServerWaitStart option enabled', function (done) {
    var express = require('express')
    var app = express()

    var reload = require('../index')
    var reloadReturned = reload(app, {webSocketServerWaitStart: true})

    var client = new net.Socket()
    var client2 = new net.Socket()

    client.connect(9856, '127.0.0.1', function () {
      // Do nothing
    })

    client.on('error', function (err) {
      if (err) {}
      reloadReturned.startWebSocketServer()

      client2.connect(9856, '127.0.0.1', function () {
        assert(true)

        client.destroy()
        client2.destroy()
        closeReloadSocket(reloadReturned, done)
      })

      client2.on('error', function (err) {
        if (err) {}
        assert(false)

        client.destroy()
        client2.destroy()
        closeReloadSocket(reloadReturned, done)
      })
    })
  })

  it.skip('Should verbose log', function (done) {
    // Should verbose log
    // var express = require('express')
    // var app = express()

    // var reload = require('../index')
    // var reloadReturned = reload(app, {verbose: true})

    // assert(false)

    // closeReloadSocket(reloadReturned, done)
  })
})

// Helper function that closes reload WebSocket server after each test
function closeReloadSocket (reloadReturned, next) {
  reloadReturned.closeServer(function () {
    next()
  })
}
