/* This file requires you install its demo dependencies
  1. Open a command prompt terminal
  2. Navigate to this folder
  3. Type "npm run install"
  4. Type "node server"
*/

var express = require('express')
var http = require('http')
var path = require('path')

//uncomment for package inclusion
//var reload = require('reload')
var reload = require('../lib/reload')

var bodyParser = require('body-parser')
var logger = require('morgan')

var app = express()

var publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded

/*
app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})*/

var server = http.createServer(app)

// Reload code here
app.use( reload.middleware(publicDir, server) )

server.listen(app.get('port'), function () {
  console.log('Web server listening on port ' + app.get('port'))
})
