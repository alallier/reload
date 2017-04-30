var path = require('path')
var fs = require('fs')

var RELOAD_FILE = path.join(__dirname, './reload-client.js')

function configureApp (expressApp, verboseLogging, route) {
  var reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

  if (verboseLogging) {
    reloadCode = reloadCode.replace('verboseLogging = false', 'verboseLogging = true')
  }

  expressApp.get(route || '/reload/reload.js', function (req, res) {
    res.type('text/javascript')
    res.send(reloadCode)
  })
}

function configureServer (httpServer, verboseLogging) {
  var connections = new Set()
  var WebSocketServer = require('ws').Server
  var wss = new WebSocketServer({ server: httpServer })

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

function reload (httpServer, expressApp, verboseLogging) {
  configureApp(expressApp, verboseLogging)
  return configureServer(httpServer, verboseLogging)
}

module.exports = reload
module.exports.configureApp = configureApp
module.exports.configureServer = configureServer
