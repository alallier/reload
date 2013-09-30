var express = require('express')
  , http = require('http')
  , path = require('path')
  , reload = require('../lib/reload')
  , fs = require('fs')
  , open = require('open')

var app = express()

var port = process.argv[2]
  , dir = process.argv[3]
  , openBrowser = (process.argv[4] === 'true')
  , runFile = process.argv[5]
  , delay = process.argv[6]

app.configure(function() {
  app.set('port', port)
  app.use(app.router) //need to be explicit, (automatically adds it if you forget)
  app.use(express.static(dir)) //should cache static assets
})

app.get('/', function(req, res) {
  var indexFile = path.join(dir, 'index.html')
  fs.exists(indexFile, function(itDoes) {
    if (itDoes)
      sendhtml(indexFile, res)
    else
      res.send(404, "can't find index.html")
  })
})

app.get('*.html', function(req, res) {
  //this wouldn't be efficient in any other context
  var file = path.join(dir, req.url)
  sendhtml(file, res)
})

var server = http.createServer(app)
reload(server, app, delay)

server.listen(app.get('port'), function(){

  if (!fs.existsSync(runFile)) {
    fs.writeFile(runFile, '')
    if (openBrowser)  
      open('http://localhost:' + app.get('port'))
  } else {
    console.log('    restarting...')
  }

})

function sendhtml (file, res) {
  fs.readFile(file, 'utf8', function(err, contents) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    contents += '\n\n<!-- Inserted by Reload -->\n<script src="/reload/reload.js"></script>\n<!-- End Reload -->\n'
    res.type('text/html')
    res.send(contents)
  })
}