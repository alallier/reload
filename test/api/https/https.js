/* global it, describe */ // npm standard ignore for describe and it

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const sinon = require('sinon')
const express = require('express')

const reload = require('../../../index')

const helperFunction = require('../../helper')

const testKeyLocation = path.join(__dirname, '/test-only.key')
const testCrtLocation = path.join(__dirname, '/test-only.crt')
const testCaPemLocation = path.join(__dirname, '/test-only-ca.pem')

const testKey = fs.readFileSync(testKeyLocation, 'utf-8')
const testCrt = fs.readFileSync(testCrtLocation, 'utf-8')
const testCaPem = fs.readFileSync(testCaPemLocation, 'utf-8')

describe('HTTPS', function () {
  it('Should create (default) `/reload/reload.js` route for reload file', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { https: { key: testKeyLocation, cert: testCrtLocation } })
    } catch (err) {
      console.error('IN ERROR', err)
    }

    var response = await helperFunction.makeRequest('/reload/reload.js', app, { https: { key: testKey, cert: testCrt, ca: testCaPem } })

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.equal(response, 200)
  })

  it('Should error with bad key file', async () => {
    sinon.stub(console, 'log').returns(void 0)
    sinon.stub(console, 'error').returns(void 0)

    var app = express()

    try {
      await reload(app, { https: { key: path.join('/somethingElse', testKeyLocation), cert: testCrtLocation } })
    } catch (err) {
      console.log.restore()
      console.error.restore()

      assert.equal(err.message, 'Could not initialize reload could not read key file')
    }
  })

  it('Should error with bad cert file', async () => {
    sinon.stub(console, 'log').returns(void 0)
    sinon.stub(console, 'error').returns(void 0)

    var app = express()

    try {
      await reload(app, { https: { key: testKeyLocation, cert: path.join('/somethingElse', testCrtLocation) } })
    } catch (err) {
      console.log.restore()
      console.error.restore()

      assert.equal(err.message, 'Could not initialize reload could not read cert file')
    }
  })

  it('Should create secure WebSocket on default port', async () => {
    var app = express()

    try {
      var reloadReturned = await reload(app, { https: { key: testKeyLocation, cert: testCrtLocation } })
    } catch (err) {

    }

    var result = await helperFunction.testWebSocket(9856, true, { key: testKey, cert: testCrt, ca: testCaPem })

    await helperFunction.closeReloadSocket(reloadReturned)

    assert.equal(result, true)
  })
})
