/*
 * Posible opts
 * port: A port to run the reload websocket on (as a number). (Optional) (Default: `8080`)
 * route: The route reload will create for the script file. (Optional) (Default `reload/reload.js`)
 * verbose: Will show logging on the server and client side. (Optional) (Default: `false`)
 */
function reload (app, opts) {
  // Requires
  var path = require('path')
  var fs = require('fs')

  // Parameters variables
  var httpServerOrPort
  var expressApp
  var verboseLogging
  var port

  // Application variables
  var RELOAD_FILE = path.join(__dirname, './reload-client.js')
  var reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')
  var route

  // Websocket server variables
  var connections = new Set()
  var WebSocketServer = require('ws').Server
  var wss

  // General variables
  var socketPortSpecified

  opts = opts || {}

  if (arguments.length > 0 && (typeof (arguments[0]) === 'number' || typeof (arguments[0]) === 'object')) {
    if (typeof (arguments[0]) === 'number') { // If old arguments passed handle old arguments, the old arguments and their order were: httpServerOrPort, expressApp, verboseLogging,
      console.warn('Deprecated Warning: You supplied reload old arguments, please upgrade to the new parameters see: https://github.com/jprichardson/reload/tree/master#api-for-express')
      httpServerOrPort = arguments[0]
      expressApp = arguments[1]
      verboseLogging = arguments[2]

      socketPortSpecified = typeof httpServerOrPort === 'number' ? httpServerOrPort : null
    } else { // Setup options
      expressApp = arguments[0]
      port = opts.port || 9856
      route = opts.route || '/reload/reload.js'
      verboseLogging = opts.verbose === true || opts.verbose === 'true' || false

      if (port) {
        socketPortSpecified = port
        httpServerOrPort = port
      }
    }
  } else {
    throw new Error('Lack of/invalid arguments provided to reload')
  }

  // Application stuff
  if (verboseLogging) {
    reloadCode = reloadCode.replace('verboseLogging = false', 'verboseLogging = true')
  }

  if (socketPortSpecified) {
    reloadCode = reloadCode.replace('window.location.origin.replace()', 'window.location.origin.replace(/(^http(s?):\\/\\/)(.*:)(.*)/,' + (socketPortSpecified ? '\'ws$2://$3' + socketPortSpecified : 'ws$2://$3$4') + '\')')
  }

  expressApp.get(route, function (req, res) {
    res.type('text/javascript')
    res.send(reloadCode)
  })

  // Websocket server stuff
  // Use custom user specified port
  if (socketPortSpecified) {
    wss = new WebSocketServer({ port: httpServerOrPort })
  } else { // Attach to server, using server's port. Kept here to support legacy arguments.
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

module.exports = reload
