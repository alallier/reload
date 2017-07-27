var http = require('http')
var path = require('path')
var reload = require('../lib/reload')
var fs = require('fs')
var open = require('open')
var clc = require('cli-color')
var argv = require('minimist')(process.argv.slice(2))

var port = argv._[0]
var dir = argv._[1]
var openBrowser = (argv._[2] === 'true')
var hostname = argv._[3]
var runFile = argv._[4]
var startPage = argv._[5]
var verbose = (argv._[6] === 'true')

var reloadOpts = {
  port: port,
  verbose: verbose,
  noExpress: true
}

var time
var reloadReturned

var server = http.createServer(function (req, res) {
  var file
  var reqUrl = req.url

  if (reqUrl === '/') {
    file = path.join(dir, startPage)
  } else {
    file = path.join(dir, reqUrl) + '.html'
  }

  appendReloadClientCode(file, function (contents) {
    if (contents) {
      res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'})
      res.end(contents)
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain; charset=UTF-8'})
      res.end('File Not Found')
    }
  })
})

// Reload call and configurations. Stub app as it isn't used here
reloadReturned = reload(function () {}, reloadOpts, server)

server.listen(port, function () {
  if (!fs.existsSync(runFile)) {
    fs.writeFileSync(runFile)

    // If openBrowser, open the browser with the given start page above, at a hostname (localhost default or specified).
    if (openBrowser) {
      open('http://' + hostname + ':' + port)
    }
  } else {
    time = new Date()
    console.log(clc.green('Server restarted  at ' + time.toTimeString().slice(0, 8)))
  }
})

// Function to send reload-client code to the browser.
function appendReloadClientCode (file, next) {
  fs.readFile(file, 'utf8', function (err, contents) {
    if (err) {
      next(null)
    }
    var reloadClientCode = reloadReturned.reloadClientCode()

    contents += '\n\n<!-- Inserted by Reload -->\n<script>' + reloadClientCode + '</script>\n<!-- End Reload -->\n'

    next(contents)
  })
}
