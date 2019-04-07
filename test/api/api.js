/* global it, describe */ // npm standard ignore for describe and it

const express = require('express')
const http = require('http')
const reload = require('../../index')
const privateReload = require('../../lib/reload')
const fs = require('fs')
const path = require('path')

var helperFunction = require('../helper')
var assert = require('assert')

describe('API', function () {
  it('Should reject if argument length is 0', async () => {
    try {
      await reload()
      assert(false)
    } catch (err) {
      assert(true)
    }
  })

  it('Should throw if first argument is not of type object or function', async () => {
    try {
      await reload('')
      assert(false)
    } catch (err) {
      assert(true)
    }
  })

  it('Should return public object', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app)
    } catch (err) {
      console.log(err)
    }

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(typeof (reloadReturned.reload), 'function')
    assert.strictEqual(typeof (reloadReturned.closeServer), 'function')
    assert.strictEqual(typeof (reloadReturned.wss), 'object')
  })

  it('Should return private object (private, command line only)', async () => {
    var app = express()

    var server = http.createServer(app)

    try {
      var reloadReturned = await privateReload(app, {}, server)
    } catch (err) {
      console.log(err)
    }

    assert.strictEqual(typeof (reloadReturned.reload), 'function')
    assert.strictEqual(typeof (reloadReturned.reloadClientCode), 'function')
    assert.strictEqual(typeof (reloadReturned.closeServer), 'function')
    assert.strictEqual(typeof (reloadReturned.wss), 'object')
  })

  it('Should create (default) `/reload/reload.js` route for reload file', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app)
    } catch (err) {

    }

    var response = await helperFunction.makeRequest('/reload/reload.js', app)

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(response.statusCode, 200)
  })

  it('Should create (custom) `/something/reload.js` route for reload file', async () => {
    var assert = require('assert')
    var app = express()

    try {
      var reloadReturned = await reload(app, { route: '/something' })
    } catch (err) {

    }

    var response = await helperFunction.makeRequest('/something/reload.js', app)

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(response.statusCode, 200)
  })

  it('Should create (custom) `/something/reload.js` route for reload file', async () => {
    var assert = require('assert')
    var app = express()

    try {
      var reloadReturned = await reload(app, { route: '/reload/reLoad.js' })
    } catch (err) {

    }

    var response = await helperFunction.makeRequest('/reload/reload.js', app)

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(response.statusCode, 200)
  })

  it('Should create WebSocket on default port', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app)
    } catch (err) {

    }

    var result = await helperFunction.testWebSocket(9856)

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(result, true, 'Could not connect to WebSocket')
  })

  it('Should error if unable to attach route to express app', async () => {
    try {
      await reload(function () {})
    } catch (err) {
      assert.strictEqual(err.message, 'Could not attach route to express app. Be sure that app passed is actually an express app')
    }
  })

  it('Should create WebSocket on custom port', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { port: 9000 })
    } catch (err) {

    }

    var result = await helperFunction.testWebSocket(9000)

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(result, true)
  })

  it('Should error if specified port is not a number', async () => {
    var app = express()

    try {
      await reload(app, { port: 'NOTANUMBER' })
      assert.fail('Not supposed to pass')
    } catch (err) {
      assert.strictEqual(err.message, 'Specified port is not of type number')
    }
  })

  it('Should make WebSocket server start wait with webSocketServerWaitStart option enabled', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { webSocketServerWaitStart: true })
    } catch (err) {

    }

    var socketBeforeResult = await helperFunction.testWebSocket(9856)

    if (socketBeforeResult) {
      assert(false)
    } else {
      reloadReturned.startWebSocketServer()

      var socketAfterResult = await helperFunction.testWebSocket(9856)

      await helperFunction.closeReloadSocket(reloadReturned)

      if (socketAfterResult) {
        assert(true)
      } else {
        assert(false, 'WebSocket did not start after calling webSocketServerWaitStart function')
      }
    }
  })

  it('Should return startWebSocketServer with webSocketServerWaitStart option enabled', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { webSocketServerWaitStart: true })
    } catch (err) {

    }

    assert.strictEqual(typeof (reloadReturned.startWebSocketServer), 'function')
  })

  it('Should not return startWebSocketServer with webSocketServerWaitStart option disabled', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { webSocketServerWaitStart: false })
    } catch (err) {

    }

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.strictEqual(typeof (reloadReturned.startWebSocketServer), 'undefined')
  })

  it('Should error if webSocketServerWaitStart not of type boolean', async () => {
    var app = express()

    try {
      await reload(app, { webSocketServerWaitStart: 'true' })
      assert.fail('Not supposed to pass')
    } catch (err) {
      assert.strictEqual(err.message, 'webSocketServerWaitStart option specified is not of type boolean')
    }
  })

  it('Should send message when calling from return API', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app)
    } catch (err) {

    }

    var result = await helperFunction.websocketConnectionMessageHelper(reloadReturned)

    await helperFunction.closeReloadSocket(reloadReturned)

    assert(result)
  })

  it('Should return private object reloadClientCode function should return client code', async () => {
    var app = express()
    var server = http.createServer(app)

    var reloadClientCodeFromFile = fs.readFileSync(path.join(__dirname, '../../lib/reload-client.js'), 'utf8')

    var reloadClientCodeFromFileFirstLine = reloadClientCodeFromFile.split('\n')[0]

    try {
      var reloadReturned = await privateReload(app, {}, server)
    } catch (err) {
      // console.log(err)
    }

    var reloadReturnedClientCodeFirstLine = reloadReturned.reloadClientCode().split('\n')[0]

    assert.strictEqual(reloadClientCodeFromFileFirstLine, reloadReturnedClientCodeFirstLine)
  })

  it('Should force wss on client with forceWss set to true', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { forceWss: true })
    } catch (err) {

    }

    var response = await helperFunction.makeRequest('/reload/reload.js', app)

    var reloadClientCode

    response.on('data', function (chunk) {
      reloadClientCode = chunk
    })

    response.on('end', function () {
      var testRegex = RegExp('wss://', 'gm')

      assert(testRegex.test(reloadClientCode))

      helperFunction.closeReloadSocket(reloadReturned)
    })
  })

  it('Should error if force wss option is not a boolean', async () => {
    var app = express()

    try {
      await reload(app, { forceWss: 'true' })
      assert.fail('Not supposed to pass')
    } catch (err) {
      assert.strictEqual(err.message, 'forceWss option specified is not of type boolean')
    }
  })
})
