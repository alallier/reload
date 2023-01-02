const http = require('http')
const reload = require('../lib/reload')
const fs = require('fs')
const open = require('open')
const clc = require('cli-color')
const argv = require('minimist')(process.argv.slice(2))

const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')

const port = argv._[0]
const dir = argv._[1]
const openBrowser = (argv._[2] === 'true')
const hostname = argv._[3]
const runFile = argv._[4]
const startPage = argv._[5]
const fallback = (argv._[6] === 'true')
const verbose = (argv._[7] === 'true')

const reloadOpts = {
  verbose,
  noExpress: true
}

let time
let reloadReturned

const serve = serveStatic(dir, { index: ['index.html', 'index.htm'] })

const server = http.createServer(function (req, res) {
  let pathname = new URL(req.url, `http://${hostname}`).pathname.slice(1)

  const fileEnding = pathname.split('.')[1]
  const noFileEnding = fileEnding === undefined

  if (fileEnding === 'html' || pathname === '/' || pathname === '' || noFileEnding) { // Server side inject reload code to html files
    if (pathname === '/' || pathname === '') {
      pathname = dir + '/' + startPage
    } else if (noFileEnding) {
      if (fs.existsSync(dir + '/' + pathname + '.html')) {
        pathname = dir + '/' + pathname + '.html'
      } else if (fallback) {
        pathname = dir + '/' + startPage
      }
    } else {
      pathname = dir + '/' + pathname
    }

    fs.readFile(pathname, 'utf8', function (err, contents) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('File Not Found')
      } else {
        contents += '\n\n<!-- Inserted by Reload -->\n<script src="/reload/reload.js"></script>\n<!-- End Reload -->\n'

        res.setHeader('Content-Type', 'text/html')
        res.end(contents)
      }
    })
  } else if (pathname === 'reload/reload.js') { // Server reload-client.js file from injected script tag
    res.setHeader('Content-Type', 'text/javascript')

    res.end(reloadReturned.reloadClientCode())
  } else { // Serve any other file using serve-static
    serve(req, res, finalhandler(req, res))
  }
})

// Reload call and configurations. Stub app as it isn't used here
reload(function () {}, reloadOpts, server).then(function (reload) {
  reloadReturned = reload
  server.listen(port, function () {
    // Reload writes a random temp file which is checked on a reload so that the browser is not opened every time a change is made
    if (!fs.existsSync(runFile)) {
      fs.writeFileSync(runFile, '')

      // If openBrowser, open the browser with the given start page above, at a hostname (localhost default or specified).
      if (openBrowser) {
        open('http://' + hostname + ':' + port)
      }
    } else {
      time = new Date()
      console.log(clc.green('Server restarted  at ' + time.toTimeString().slice(0, 8)))
    }
  })
}).catch(function (err) {
  console.error('Could not start reload server', err)
  process.exit()
})
