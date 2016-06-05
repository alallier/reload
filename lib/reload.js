var sockjs = require('sockjs')
var path = require('path')
var fs = require('fs')

var SOCKJS_FILE = path.join(__dirname, './sockjs-0.3-min.js')
var RELOAD_FILE = path.join(__dirname, './reload-client.js')

module.exports = function reload (httpServer, expressApp, reloadDelay, wait) {
  // this happens at startup of program, so sync is alright
  var sockjsCode = fs.readFileSync(SOCKJS_FILE, 'utf8')
  var reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')
  var conn

  // if reloadDelay is specified as true then reload will wait for the server to be up before reloading the page
  if (wait === true) {
    reloadCode = reloadCode.replace('wait = false;', 'wait = true;')
    reloadCode = reloadCode.replace('socketDelay = 0;', 'socketDelay = ' + reloadDelay)
  }

  reloadCode = reloadCode.replace('reloadDelay = 300;', 'reloadDelay = ' + reloadDelay)

  var clientCode = sockjsCode + '\n\n' + reloadCode

  var reload = sockjs.createServer({ log: function () {} })
  reload.on('connection', function (connection) {
    conn = connection
  })
  reload.installHandlers(httpServer, {prefix: '/sockreload'})

  expressApp.get('/reload/reload.js', function (req, res) {
    res.type('text/javascript')
    res.send(clientCode)
  })

  return {
    'server': reload,
    'connection': conn,
    'reload': function () {
      this.sendMessage('reload')
    },
    'sendMessage': function (command) {
      if (conn) {
        conn.write(command)
      } else {
        console.log('Cannot send "' + command + '" to client: still not connected')
      }
    }
  }
}
