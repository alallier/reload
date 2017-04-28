var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('../lib/reload')
var fs = require('fs')
var open = require('open')
var clc = require('cli-color')
var argv = require('minimist')(process.argv.slice(2))

var app = express()

var port = argv._[0]
var dir = argv._[1]
var openBrowser = (argv._[2] === 'true')
var hostname = argv._[3]
var runFile = argv._[4]
var startPage = argv._[5]
var verbose = (argv._[6] === 'true')

var router = express.Router()

app.set('port', port)

router.get('/', function (req, res, next) {
  // Create the start page path.
  var startFile = path.join(dir, startPage)

  fs.access(startFile, function (err) {
    // If the start page doesn't exist (whether it's the deault index.html or specified).
    if (err) {
      res.status(404).send("Can't find " + startPage)
    } else {
      // Else the start page exists send the reload-client code to the HTML.
      sendhtml(startFile, res)
    }
  })
})

// Routing for any HTML, so that we can send the reload-client file to every HTML page when naviagted too.
router.get('*.html', function (req, res) {
  // This wouldn't be efficient in any other context.
  var file = path.join(dir, req.url)
  sendhtml(file, res)
})

app.use('/', router)
app.use('*html', router)

app.use(express.static(dir)) // Should cache static assets.

var server = http.createServer(app)

// Reload call and configurations.
reload(server, app, verbose)

server.listen(app.get('port'), function () {
  if (!fs.existsSync(runFile)) {
    fs.writeFile(runFile, '')

    // If openBrowser, open the browser with the given start page above, at a hostname (localhost default or specified).
    if (openBrowser) {
      open('http://' + hostname + ':' + app.get('port'))
    }
  } else {
    console.log(clc.green('restarting...'))
  }
})

// Function to send reload-client code to the browser.
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
