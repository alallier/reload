/* global it, describe */ // npm standard ignore for describe and it

const express = require('express')
const helperFunction = require('../helper')
const assert = require('assert')
const reload = require('../../index')
const sinon = require('sinon')

describe('Verbose', function () {
  it('Should verbose log \'Starting WebSocket Server\'', async () => {
    sinon.stub(console, 'log').returns(void 0)
    sinon.stub(console, 'error').returns(void 0)

    var app = express()

    try {
      var reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    await helperFunction.closeReloadSocket(reloadReturned)

    let logFound = helperFunction.checkForConsoleLog(console.log.args, 'Starting WebSocket Server')

    assert(logFound, '\'Starting WebSocket Server\' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should verbose log \'Reload client connected to server\' when a one client connects\' when client is connected', async () => {
    sinon.stub(console, 'log').returns(void 0)
    sinon.stub(console, 'error').returns(void 0)

    var app = express()

    try {
      var reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    await helperFunction.testWebSocket(9856)

    let foundLog = helperFunction.checkForConsoleLog(console.log.args, 'Reload client connected to server')

    await helperFunction.closeReloadSocket(reloadReturned)

    assert(foundLog, '\'Reload client connected to server\' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should verbose log \'Sending message to 1 connection(s): reload\' when `reload` is called from return API', async () => {
    sinon.stub(console, 'log').returns(void 0)
    sinon.stub(console, 'error').returns(void 0)

    var app = express()

    try {
      var reloadReturned = await reload(app, { verbose: true })
    } catch (err) {

    }

    await helperFunction.websocketConnectionMessageHelper(reloadReturned)

    let foundLog = helperFunction.checkForConsoleLog(console.log.args, 'Sending message to 1 connection(s): reload')

    await helperFunction.closeReloadSocket(reloadReturned)

    assert(foundLog, '\'Sending message to 1 connection(s): reload\' not found in console logging')

    console.log.restore()
    console.error.restore()
  })

  it('Should error if verbose logging option is not a boolean', async () => {
    var app = express()

    try {
      await reload(app, { verbose: 'true' })
      assert.fail('Not supposed to pass')
    } catch (err) {
      assert.strictEqual(err.message, 'verboseLogging option specified is not of type boolean')
    }
  })
})
