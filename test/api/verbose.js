/* global it, describe */ // npm standard ignore for describe and it

const express = require('express')
const helperFunction = require('../helper')
const assert = require('assert')
const reload = require('../../index')
const sinon = require('sinon')

describe('Verbose', function () {
  it('Should verbose log \'Starting WebSocket Server\'', async () => {
    sinon.stub(console, 'log').returns(0)
    sinon.stub(console, 'error').returns(0)

    const app = express()

    let reloadReturned
    try {
      reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    await helperFunction.closeReloadSocket(reloadReturned)

    const logFound = helperFunction.checkForConsoleLog(console.log.args, 'Starting WebSocket Server')

    assert(logFound, '\'Starting WebSocket Server\' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should verbose log \'Reload client connected to server\' when a one client connects\' when client is connected', async () => {
    sinon.stub(console, 'log').returns(0)
    sinon.stub(console, 'error').returns(0)

    const app = express()

    let reloadReturned
    try {
      reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    await helperFunction.testWebSocket(9856)

    const foundLog = helperFunction.checkForConsoleLog(console.log.args, 'Reload client connected to server')

    await helperFunction.closeReloadSocket(reloadReturned)

    assert(foundLog, '\'Reload client connected to server\' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should verbose log \'Sending message to 1 connection(s): reload\' when `reload` is called from return API', async () => {
    sinon.stub(console, 'log').returns(0)
    sinon.stub(console, 'error').returns(0)

    const app = express()

    let reloadReturned
    try {
      reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    await helperFunction.websocketConnectionMessageHelper(reloadReturned)

    const foundLog = helperFunction.checkForConsoleLog(console.log.args, 'Sending message to 1 connection(s): reload')

    await helperFunction.closeReloadSocket(reloadReturned)

    assert(foundLog, '\'Sending message to 1 connection(s): reload\' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should verbose log if increment was required if default/specified port is unavailable', async () => {
    sinon.stub(console, 'log').returns(0)
    sinon.stub(console, 'error').returns(0)

    const net = require('net')
    const server = net.createServer()

    server.listen(9856)

    var app = express()

    try {
      var reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    const foundLog = helperFunction.checkForConsoleLog(console.log.args, 'Incremented port number. Server running on:', reloadReturned.port)

    await helperFunction.closeReloadSocket(reloadReturned)

    server.close()

    assert(foundLog, 'Incremented port number. Server running on: ' + reloadReturned.port + ' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should error if verbose logging option is not a boolean', async () => {
    const app = express()

    try {
      await reload(app, { verbose: 'true' })
      assert.fail('Not supposed to pass')
    } catch (err) {
      assert.strictEqual(err.message, 'verboseLogging option specified is not of type boolean')
    }
  })
})
