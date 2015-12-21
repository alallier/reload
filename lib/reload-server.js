var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('../lib/reload')
var fs = require('fs')
var open = require('open')

var app = express()

var port = process.argv[2]
var dir = process.argv[3]
var openBrowser = (process.argv[4] === 'true')
var hostname = process.argv[5]
var runFile = process.argv[6]
var reloadDelay = process.argv[7]
var wait = (process.argv[8] === 'true')
var startPage = process.argv[9]

var router = express.Router()

app.set('port', port)

router.get('/', function (req, res, next) {
  var startFile = path.join(dir, startPage)
  fs.exists(startFile, function (itDoes) {
    if (itDoes) sendhtml(startFile, res)
    else res.status(404).send("Can't find " + startPage)
  })
})

router.get('*.html', function (req, res) {
  // this wouldn't be efficient in any other context
  var file = path.join(dir, req.url)
  sendhtml(file, res)
})

app.use('/', router)
app.use('*html', router)

app.use(express.static(dir)) // should cache static assets

var server = http.createServer(app)
reload(server, app, reloadDelay, wait)

server.listen(app.get('port'), function () {
  if (!fs.existsSync(runFile)) {
    fs.writeFile(runFile, '')
    if (openBrowser) open('http://' + hostname + ':' + app.get('port'))
  } else {
    console.log('    restarting...')
  }
})

function sendhtml (file, res) {
  fs.readFile(file, 'utf8', function (err, contents) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    contents += '\n\n<!-- Inserted by Reload -->\n<script src="/reload/reload.js"></script>\n<!-- End Reload -->\n'
    res.type('text/html')
    res.send(contents)
  })
}
