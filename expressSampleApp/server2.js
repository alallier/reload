var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')

var app = express()

var publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded

// add reload/reload.js route to app to server client script
reload.configureApp(app, true)

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})

var server = http.createServer(app)
// start web socket server that sends messages
reload.configureServer(server, true)

server.listen(app.get('port'), function () {
  console.log('Web server listening on port ' + app.get('port'))
})
