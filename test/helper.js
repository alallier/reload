const WebSocket = require('ws')

// Helper function that closes reload WebSocket server after each test
function closeReloadSocket (reloadReturned) {
  return reloadReturned.closeServer()
}

async function makeRequest (path, app, options) {
  // console.log(options)
  var http = require('http')
  var https = require('https')
  var httpOrHttpServer

  var options = options || {}

  if (options.https) {
    httpOrHttpServer = https.createServer({ key: options.https.key, cert: options.https.cert, ca: [ options.https.ca ] }, app)
  } else {
    httpOrHttpServer = http.createServer(app)
  }

  return new Promise(function (resolve, reject) {
    httpOrHttpServer.listen(8080, function () {
      if (options.https) { // HTTPS
        var optionsHTTPS = {
          host: 'localhost',
          path: path,
          port: 8080,
          key: options.https.key,
          cert: options.https.cert,
          ca: [ options.https.ca ]
        }

        https.get(optionsHTTPS, function (response) {
          httpOrHttpServer.close(function () {
            resolve(response.statusCode)
          })
        }).on('error', (e) => {
          console.error('ERROR: ', e)
        })
      } else { // HTTP
        http.get({
          host: 'localhost',
          path: path,
          port: 8080
        }, function (response) {
          httpOrHttpServer.close(function () {
            resolve(response.statusCode)
          })
        })
      }
    })
  })
}

async function testWebSocket (port, secure, httpOptions) {
  var ws
  if (secure) {
    ws = new WebSocket((secure === true ? 'wss' : 'ws') + '://localhost:' + (port || '9856'), {
      key: httpOptions.key,
      cert: httpOptions.cert,
      ca: [ httpOptions.ca ]
    })
  } else {
    ws = new WebSocket((secure === true ? 'wss' : 'ws') + '://localhost:' + (port || '9856'))
  }

  return new Promise(function (resolve, reject) {
    ws.on('open', function open () {
      resolve(true)
    })

    ws.on('error', function (err) {
      resolve(false)
    })
  })
}

async function websocketConnectionMessageHelper (reloadReturnApi) {
  const ws = new WebSocket('ws://localhost:9856')
  return new Promise(function (resolve, reject) {
    ws.on('open', function open () {
      reloadReturnApi.reload()
    })

    ws.on('message', function incoming (data) {
      resolve(true)
    })
  })
}

function checkForConsoleLog (logs, expected) {
  let encounteredLog = false

  for (let i = 0; i < logs.length; i++) {
    if (console.log.args[i][0] === expected) {
      encounteredLog = true
      return true
    }
  }

  if (encounteredLog === false) {
    return false
  }
}

exports.closeReloadSocket = closeReloadSocket
exports.makeRequest = makeRequest
exports.testWebSocket = testWebSocket
exports.websocketConnectionMessageHelper = websocketConnectionMessageHelper
exports.checkForConsoleLog = checkForConsoleLog