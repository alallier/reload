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

const testP12Location = path.join(__dirname, '/test-only.pfx')

const testKey = fs.readFileSync(testKeyLocation)
const testCrt = fs.readFileSync(testCrtLocation)
const testCaPem = fs.readFileSync(testCaPemLocation)

const testP12 = fs.readFileSync(testP12Location)

console.log(typeof testKey)

describe('HTTPS', function () {
  it('Should error if `certAndKey` and `p12` are not defined in HTTPS options', async () => {
    sinon.stub(console, 'log').returns(void 0)
    sinon.stub(console, 'error').returns(void 0)

    var app = express()

    try {
      await reload(app, { https: { } })
    } catch (err) {
      console.log.restore()
      console.error.restore()

      assert.strictEqual(err.message, 'Could not initialize reload HTTPS setup incorrectly. Make sure to define a `p12` or `certAndKey` in the HTTPS options')
    }
  })

  describe('HTTPS - Cert and Key', function () {
    it('Should create (default) `/reload/reload.js` route for reload file', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { certAndKey: { key: testKeyLocation, cert: testCrtLocation } } })
      } catch (err) {
        console.error('IN ERROR', err)
      }

      var response = await helperFunction.makeRequest('/reload/reload.js', app, { https: { key: testKey, cert: testCrt, ca: testCaPem } })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(response.statusCode, 200)
    })

    it('Should accept HTTPS key as file contents', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { certAndKey: { key: testKey, cert: testCrtLocation } } })
      } catch (err) {
        console.error('IN ERROR', err)
      }

      var response = await helperFunction.makeRequest('/reload/reload.js', app, { https: { key: testKey, cert: testCrt, ca: testCaPem } })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(response.statusCode, 200)
    })

    it('Should accept HTTPS cert as file contents', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { certAndKey: { key: testKey, cert: testCrt } } })
      } catch (err) {
        console.error('IN ERROR', err)
      }

      var response = await helperFunction.makeRequest('/reload/reload.js', app, { https: { key: testKey, cert: testCrt, ca: testCaPem } })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(response.statusCode, 200)
    })

    it('Should error with bad key file', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { certAndKey: { key: path.join('/somethingElse', testKeyLocation), cert: testCrtLocation } } })
      } catch (err) {
        return assert(true)
      }

      await helperFunction.closeReloadSocket(reloadReturned)
      return assert(false)
    })

    it('Should error with bad cert file', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { certAndKey: { key: testKeyLocation, cert: path.join('/somethingElse', testCrtLocation) } } })
      } catch (err) {
        return assert(true)
      }

      await helperFunction.closeReloadSocket(reloadReturned)
      return assert(false)
    })

    it('Should create secure WebSocket on default port', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { certAndKey: { key: testKeyLocation, cert: testCrtLocation } } })
      } catch (err) {
        assert(false, err)
      }

      var result = await helperFunction.testWebSocket(9856, true, { key: testKey, cert: testCrt, ca: testCaPem })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(result, true)
    })
  })

  describe('HTTPS - PFX', function () {
    it('Should create (default) `/reload/reload.js` route for reload file', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { p12: { p12Path: testP12Location, passphrase: '1234' } } })
      } catch (err) {
        assert(false, err)
      }

      var response = await helperFunction.makeRequest('/reload/reload.js', app, { https: { key: testKey, cert: testCrt, ca: testCaPem } })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(response.statusCode, 200)
    })

    it('Should accept pfx as file contents', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { p12: { p12Path: testP12, passphrase: '1234' } } })
      } catch (err) {
        assert(false, err)
      }

      var response = await helperFunction.makeRequest('/reload/reload.js', app, { https: { key: testKey, cert: testCrt, ca: testCaPem } })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(response.statusCode, 200)
    })

    it('Should error with bad pxf file', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { p12: { p12Path: path.join('/somethingElse', testP12Location), passphrase: '1234' } } })
      } catch (err) {
        return assert(true)
      }

      await helperFunction.closeReloadSocket(reloadReturned)
      return assert(false)
    })

    it('Should create secure WebSocket on default port', async () => {
      var app = express()

      try {
        var reloadReturned = await reload(app, { https: { p12: { p12Path: testP12Location, passphrase: '1234' } } })
      } catch (err) {
        assert(false, err)
      }

      var result = await helperFunction.testWebSocket(9856, true, { key: testKey, cert: testCrt, ca: testCaPem })

      await helperFunction.closeReloadSocket(reloadReturned)

      assert.strictEqual(result, true)
    })
  })
})
