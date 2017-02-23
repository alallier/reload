var path = require('path')
var fs = require('fs')
var WebSocket = require('ws')
var RELOAD_FILE = path.join(__dirname, './reload-client.js')
var reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

var ackReloadLog = require('./log.function')
var http = require('http')
var static = require('node-static')
var promisePrompt = require('./promisePrompt.function')
var open = require('open')
var watch = require('watch')
var filterMaker = require('./filterMaker.function')

module.exports = servePath
module.exports.reloadSocketByHttp = reloadSocketByHttp
module.exports.middleware = middleware


/** Returns promise of Object{httpServer:Object, reload:Function, port:Number}
  @pathTo String = currentWorkingDirectory
  @options{
    port Number,
    log Function = console.log,
    open Boolean = true,
    message String - when port is in use, tailor prompt messages label
    filter Function - file watching filter,
    watch Boolean = true - Enable/disable watching files. Manual reload will be required
  }
*/
function servePath(pathTo, options){
  pathTo = pathTo || process.cwd()//currentWorkingDirectory
  return createFolderWatchServer(pathTo, options)
}

/** returns Function(request, response) . Does not watch files, use reloadSocketByHttp to establish watch and websocket
  @pathTo String - path to serve
  @httpServer Object - Use to establish file watching and reload websocket
  @options Object - See servePath options
*/
function middleware(pathTo, httpServer, options){
  var fileRouter = new static.Server(pathTo,{cache:false});

  var routes = function(req, res){
    if( req.url.toLowerCase().search(/reload\/reload\.js/)>=0 ){
      return routes.sendScript(req, res)
    }

    var urlReview = req.url.replace(/\?.*/g,'')
    var index = urlReview ==='/' || urlReview.search(/[^?]*(\.html)/)>=0

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
    var reqFile = req.url.replace(/(.*\/)([^?]*)(\?.*)*/g,'$2')
    reqFile = reqFile || 'index.html'
    reqFile = reqFile.replace('/',path.sep)
    var readFile = path.join(pathTo,reqFile)

    var fileContents = fs.readFile(readFile,function(err,buff){

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

      var fileContents = buff.toString() + '<script src="reload/reload.js"></script>'
      res.end(fileContents)
    })
  }

  if(httpServer){
    routes.reload = reloadSocketByHttp(pathTo, httpServer, options)
  }

  return routes
}

/** return promise */
function createFolderWatchServer(outputFileFolder, options){
  options = options || {}
  options.port = options.port || 8080
  options.log = options.log || ackReloadLog
  options.open = options.open==null ? true : options.open

  var app = module.exports.middleware(outputFileFolder, null, options)

  return startServer(app, options.port, options)
  .then(function(config){
    if(config.httpServer){    
      config.reload = reloadSocketByHttp(outputFileFolder, config.httpServer, options)
      
      if(options.watch || options.watch==null){
        options.log('watching', outputFileFolder)
      }
  
      if(options.open){    
        options.hostname = options.hostname || 'localhost'
        var urlPath = 'http://'+options.hostname+':' + config.port + '/'
        if(options.startPage){
          urlPath += options.startPage
        }
        open(urlPath)
        options.log('serving '+urlPath)
      }
    }else{
      options.log('live reload server and file watching skipped')
    }

    return config
  })
}

function reloadSocketByHttp(pathTo, httpServer, options){
  options = options || {}

  var WebSocketServer = WebSocket.Server
  var wss = new WebSocketServer({ server: httpServer })

  var reloader = function(){
    wss.clients.forEach(function each(client){
      if (client.readyState === WebSocket.OPEN){
        client.send('reload')
      }
    })
  }

  if(options.watch || options.watch==null){
    watchPath(pathTo, reloader, options)
  }

  return reloader
}

/** returns watch.createMonitor. See npm watch */
function watchPath(pathTo, reloader, options){
  options = options || {}
  options.filter = options.filter || filterMaker('js','css','html')

  return watch.createMonitor(pathTo, options, function (monitor) {
    monitor.on("created", reloader)
    monitor.on("changed", reloader)
    monitor.on("removed", reloader)
  })
}

/** returns promise Object{httpServer,port} */
function startServer(app, port, options){
  return new Promise(function(respond,reject){
    var httpServer = http.createServer(app)

    httpServer.once('error',function(e){
      reject(e)
    })

    httpServer.once('listening',function(e){
      respond({httpServer:httpServer, port:port})
    })

    httpServer.listen(port)
  })
  .catch(function(e){
    if(e.code=='EADDRINUSE'){
      return promptPortInUse(app, port, options)
    }

    throw e
  })
  .then(function(config){
    promisePrompt.stop()
    return config
  })
}

/** returns promise */
function promptPortInUse(app, port, options){
  return promisePrompt([{
    description:'Port '+port+' in use. Type new port number. 0 to stop:',
    name:'port',
    default:port+1,
    pattern: /^[0-9]+$/,
    message: 'Port must be a number',
  }],options)
  .then(function(res){
    var port = Number(res.port)
    if(port){
      return startServer(app, port, options)
    }
  })
}

