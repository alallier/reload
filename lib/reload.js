const path = require('path')
const fs = require('fs')
const WebSocket = require('ws')
const RELOAD_FILE = path.join(__dirname, './reload-client.js')
const reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

const ackReloadLog = require('./log.function')
const http = require('http')
const static = require('node-static')
const promisePrompt = require('./promisePrompt.function')
const open = require('open')
const watch = require('watch')
const filterMaker = require('./filterMaker.function')

module.exports = servePath
module.exports.middleware = middleware


/**
  @pathTo String = currentWorkingDirectory
  @options{
    port Number,
    log Function = console.log,
    open Boolean = true,
    message String - when port is in use, tailor prompt messages label
  }
*/
function servePath(pathTo, options){
  pathTo = pathTo || process.cwd()//currentWorkingDirectory
  return createFolderWatchServer(pathTo, options)
}

function middleware(pathTo){
  const fileRouter = new static.Server(pathTo,{cache:false});

  const routes = function(req, res){
    if(req.url.toLowerCase()=='/reload/reload.js'){
      return routes.sendScript(req, res)
    }

    const index = req.url ==='/' || req.url.search(/[^?]*(\.html)(\?.)*/)>=0

    if(index){
      return routes.indexRequest(req,res)
    }
    
    fileRouter.serve(req,res)
  }
  
  routes.sendScript = function(req,res){
    res.setHeader('Content-Type','text/javascript')    
    res.end(reloadCode)
  },
  
  routes.indexRequest = function(req,res){
    let reqFile = req.url.replace(/(.*\/)([^?]*)(\?.*)*/g,'$2')
    reqFile = reqFile || 'index.html'
    reqFile = reqFile.replace('/',path.sep)
    const readFile = path.join(pathTo,reqFile)

    let fileContents = fs.readFile(readFile,(err,buff)=>{

      if(err){
        res.setHeader('Content-Type','text/plain')
        res.statusCode = 404
        
        if(err.code=='ENOENT'){
          return res.end('404 '+reqFile+' File Not Found')
        }
      }

      res.setHeader('Content-Type','text/html')
      res.setHeader('Cache-Control','no-cache, no-store, must-revalidate')
      res.setHeader('Pragma','no-cache')
      res.setHeader('Expires','0')

      const fileContents = buff.toString() + '<script src="/reload/reload.js"></script>'
      res.end(fileContents)
    })
  }

  return routes
}

function createFolderWatchServer(outputFileFolder, options){
  options = options || {}
  options.port = options.port || 3000
  options.log = options.log || ackReloadLog
  options.open = options.open==null ? true : options.open

  const app = module.exports.middleware(outputFileFolder)

  return startServer(app, options.port, options)
  .then(config=>{
    if(config.httpServer){    
      reloadSocketByHttp(outputFileFolder, config.httpServer, options)
      options.log('watching', outputFileFolder)
  
      if(options.open){    
        options.hostname = options.hostname || 'localhost'
        let urlPath = 'http://'+options.hostname+':' + config.port + '/'
        if(options.startPage){
          urlPath += options.startPage
        }
        open(urlPath)
        options.log('serving '+urlPath)
      }
    }else{
      options.log('live reload skipped')
    }

  })
}

function reloadSocketByHttp(pathTo, httpServer, options){
  var WebSocketServer = WebSocket.Server
  var wss = new WebSocketServer({ server: httpServer })

  const reloader = function(){
    wss.clients.forEach(function each(client){
      if (client.readyState === WebSocket.OPEN){
        client.send('reload')
      }
    })
  }

  options.filter = options.filter || filterMaker('js','css','html')

  watch.createMonitor(pathTo, options, function (monitor) {
    monitor.on("created", reloader)
    monitor.on("changed", reloader)
    monitor.on("removed", reloader)
  })

  return reloader
}


function startServer(app, port, options){
  return new Promise(function(respond,reject){
    const httpServer = http.createServer(app)

    httpServer.once('error',function(e){
      reject(e)
    })

    httpServer.once('listening',function(e){
      respond({httpServer:httpServer, port:port})
    })

    httpServer.listen(port)
  })
  .catch(e=>{
    if(e.code=='EADDRINUSE'){
      return promptPortInUse(app, port, options)
    }

    throw e
  })
  .then(config=>{
    promisePrompt.stop()
    return config
  })
}

function promptPortInUse(app, port, options){
  return promisePrompt([{
    description:'Port '+port+' in use. Type new port number. 0 to stop:',
    name:'port',
    default:port+1,
    pattern: /^[0-9]+$/,
    message: 'Port must be a number',
  }],options)
  .then(res=>{
    const port = Number(res.port)
    if(port){
      return startServer(app, port, options)
    }
  })
}

