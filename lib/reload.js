var path = require('path')
var fs = require('fs')
var socketPortSpecified

var RELOAD_FILE = path.join(__dirname, './reload-client.js')

function configureApp (expressApp, verboseLogging, route) {
  var reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

  if (verboseLogging) {
    reloadCode = reloadCode.replace('verboseLogging = false', 'verboseLogging = true')
  }

  if (socketPortSpecified) {
    reloadCode = reloadCode.replace('window.location.origin.replace()', 'window.location.origin.replace(/(^http(s?):\\/\\/)(.*:)(.*)/, \'ws$2://$3' + socketPortSpecified + '\')')
  } else {
    reloadCode = reloadCode.replace('window.location.origin.replace()', 'window.location.origin.replace(/^http(s?):\\/\\//, \'ws$1://\')')
  }

  expressApp.get(route || '/reload/reload.js', function (req, res) {
    res.type('text/javascript')
    res.send(reloadCode)
  })
}

function configureServer (httpServerOrPort, verboseLogging) {
  var connections = new Set()
  var WebSocketServer = require('ws').Server
  var wss

  // Use custom user specified port
  if (socketPortSpecified) {
    wss = new WebSocketServer({ port: httpServerOrPort })
  } else { // Attach to server, using server's port
    wss = new WebSocketServer({ server: httpServerOrPort })
  }

  wss.on('connection', (ws) => {
    connections.add(ws)
    ws.on('close', function () {
      connections.delete(ws)
    })

    if (verboseLogging) {
      console.log('Reload client connected to server')
    }
  })

  function sendMessage (message) {
    if (verboseLogging) {
      console.log('Sending message to ' + (connections.size) + ' connections: ' + message)
    }
    for (let conn of connections) {
      conn.send(message, function (error) {
        if (error) {
          console.error(error)
        }
      })
    }
  }
  // Return an object, so that the user can manually reload the server by calling the returned function reload. Using the web socket connection from above, we provide a function called reload which passes the command 'reload' to the function sendMessage. sendMessage sends the message 'reload' over the socket (if the socket is connected) to the client. The client then recieves the messages checks to see if the message is reload and then reloads the page.
  return {
    'connections': connections,
    'server': reload,
    'reload': function () {
      sendMessage('reload')
    },
    'sendMessage': sendMessage
  }
}

/*
 * Posible parametes in objectOfParameters
 * server: The Node.js http server from the module `http` (Optional, but if omitted port is required.)
 * port: A port to run the reload websocket on (as a number). (Optional, but if omitted server is required.)
 * app: The express app.
 * verbose: Will show logging on the server and client side. (Optional)
 */
function reload (objectOfParameters) {
  if (arguments.length > 1) { // If old arguments passed, these were the old arguments and their order: httpServerOrPort, expressApp, verboseLogging
    console.warn('Deprecated Warning: You supplied reload old arguments, please upgrade to the new object parameter see: https://github.com/jprichardson/reload/tree/master#api-for-express')
    httpServerOrPort = arguments[0]
    expressApp = arguments[1]
    verboseLogging = arguments[2]

    socketPortSpecified = typeof httpServerOrPort === 'number' ? httpServerOrPort : null
  }
  else {
    httpServer = objectOfParameters.server;
    port = objectOfParameters.port;
    expressApp = objectOfParameters.app;
    verboseLogging = objectOfParameters.verbose === true || objectOfParameters.verbose === 'true' ? true : false;

    httpServerOrPort = httpServer

    if (port) {
      socketPortSpecified = port;
      httpServerOrPort = port
    }
  }

  configureApp(expressApp, verboseLogging)
  return configureServer(httpServerOrPort, verboseLogging)
}

module.exports = reload
module.exports.configureApp = configureApp
module.exports.configureServer = configureServer
