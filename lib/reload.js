var sockjs = require('sockjs')
  , path  = require('path')
  , fs = require('fs')

var SOCKJS_FILE = path.join(__dirname, './sockjs-0.3-min.js')
  , RELOAD_FILE = path.join(__dirname, './reload-client.js')

module.exports = function reload (httpServer, expressApp, time_ms) {
  //this happens at startup of program, so sync is alright
  var sockjsCode = fs.readFileSync(SOCKJS_FILE, 'utf8')
    , reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

  if (time_ms) {
    reloadCode = reloadCode.replace('RLD_TIMEOUT = 300', 'RLD_TIMEOUT = ' + time_ms)
  }

  var clientCode = sockjsCode + '\n\n' + reloadCode

  var reload = sockjs.createServer()
  reload.installHandlers(httpServer, {prefix: '/sockreload'})

  expressApp.get('/reload/reload.js', function(req, res) {
    res.type('text/javascript')
    res.send(clientCode)
  })
}