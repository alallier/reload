var path = require('path')
var fs = require('fs')

var RELOAD_FILE = path.join(__dirname, './reload-client.js')

module.exports = function reload (httpServer, app, verboseLogging, options) {
  var reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

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

  if (verboseLogging) {
    reloadCode = reloadCode.replace('verboseLogging = false', 'verboseLogging = true')
  }

  if (options.koa === true) {
    app.use((ctx, next) => {
      if (ctx.request.url === '/reload/reload.js') {
        ctx.response.type = 'text/javascript'
        ctx.response.body = reloadCode
      }

      return next()
    })
  } else {
    app.get('/reload/reload.js', function (req, res) {
      res.type('text/javascript')
      res.send(reloadCode)
    })
  }

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
