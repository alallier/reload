reload
=======

[![build status](https://api.travis-ci.org/jprichardson/reload.svg)](http://travis-ci.org/jprichardson/reload)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM version](https://img.shields.io/npm/v/reload.svg?style=flat-square)](https://www.npmjs.com/package/reload)

Automatically refresh and reload your code in your browser when your code changes. No browser plugins required.

Why?
----

Restarting your HTTP server and refreshing your browser is annoying.

### Table of Contents
- [How does it work?](#how-does-it-work)
- [Upgrading from v1 to v2](#upgrading-from-v1-to-v2)
- [Installation](#installation)
- [Examples](#examples)
  - [Stand-Alone Example](#stand-alone-example)
  - [Express Example](#express-example)
  - [Manually Reloading](#manually-reloading)
  - [Advanced Full Featured Example](#advanced-full-featured-example)
- [API](#api)
  - [Middlware](#middlware)
  - [Arguments](#arguments)
- [Commands](#commands)
- [License](#license)

## How does it work?

Reload works in three different ways depending on if you're using it:

1. Run reload in NodeJs process with full API control using config options
2. Use reload middleware to "attach" reload to a existing server route
3. As a command line tool which starts its own Server to monitor the file(s) you're editing for changes and to serve `reload-client.js` to the browser.

Once reload-server and reload-client are connected, the client side code opens a [WebSocket](https://en.wikipedia.org/wiki/WebSocket) to the server and waits for the WebSocket to close, once it closes, reload waits for the server to come back up (waiting for a socket on open event), once the socket opens we reload the page.

### Upgrading from v1 to v2
The following major changes have taken place

> Breaking Change: v2 includes use of native Promise. NodeJs .12+ is required

- EADDRINUSE prompt
  - Added EADDRINUSE catcher that starts a cli-prompt when desired port is in use. Another port can be supplied to start server on another open port.
- Multiple connections supported
  - Now multiple browsers and multiple web socket connections can be maintained
- Watching Files
  - Watching files is more intuitive and actually available outside of just the CLI
- Better Logging
  - Better verbose logging where an outside library can mandate how logging occurs
- Weight loss
  - Removed a great amount of weight in dependencies. Package is far simpler to use and weighs far less
  - Express no longer a dependency
- More ways to implement
  - Connect to any server, not just an express server. The non-cli reload.js is far more functional and easier to integrate into other projects.
- Better Client Script Inclusion
  - reload package auto appends client script to all html requests

Express app v1
```
var app = express()
var publicDir = path.join(__dirname, 'public')

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})

var server = http.createServer(app)
reload(server, app)
server.listen(3000)
```

Express app v2
```
var app = express()
var publicDir = path.join(__dirname, 'public')

//Only host reload software. Create websocket to http attachment. File watching
app.use( reload.middleware(publicDir, server) )

http.createServer(app).listen(3000)
```


## Installation

```
npm install [-g] [--save-dev] reload
```

#### Typical Package Installation
```
npm install --save-dev reload
```

#### Typical Global Installation
```
npm install -g reload
```

## Examples

Three ways to use reload
---

There are three different ways to use reload.

1. As a server, allowing reload to host your whole project
2. As middleware, allowing your exsting server project to utilize reload
2. As a command line application to serve up static HTML files and be able to reload when the code is altered

Using reload in Express
---
When used with Express reload creates a new Express route for reload. When you restart the server, the client will detect the server being restarted and automatically refresh the page.

Reload can be used in conjunction with tools that allow for automatically restarting the server such as [supervisor](https://github.com/isaacs/node-supervisor) (recommended), [nodemon](https://github.com/remy/nodemon), [forever](https://github.com/nodejitsu/forever), etc.

### Stand-Alone Example
Serve and watch a folder all in one

**`server.js`:**
```javascript
var reload = require('reload')
var publicDir = path.join(__dirname, 'public')

reload(publicDir,{port:3000})
```

### Express Example
Serve and watch a folder on an existing server

**`server.js`:**
```javascript
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
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded

var server = http.createServer(app)

// Reload code only on www url-path from public folder path
app.use("/www" reload.middleware(publicDir, server) )

// Another Reload code here only on admin url-path to admin folder path
var adminPath = path.join(__dirname,'admin')
app.use("/admin", reload.middleware(adminPath, server))

server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});
```

A demo template that has a change with every reload
**`public/index.html`:**
```html
<!doctype html>
<html>
  <head>
    <title>Reload Express Sample App</title>
  </head>
  <body>
    <h1>Reload Express Sample App</h1>
    <br />
    <div>Current Time: <script>document.write(Date.now())</script></div>
    <br />
    <div>Script Time: <script src="www/outputTime.js"></script></div>
  </body>
</html>
```

**Refer to the [reload express sample app](https://github.com/jprichardson/reload/tree/master/expressSampleApp) for this working example.**

### Manually Reloading

Two ways to approach:
- Manually call returned reload function after starting a reload server
- Integrate the reload function into running middleware

Manually Reloading Application
```
var publicDir = path.join(__dirname, 'public')
var reload = require('reload')

reload(publicDir)
.then(config=>{
  //force reload every 10 seconds of all browser websocket connections
  setInterval(config.reload, 10000);

  //stop reload services after 30 seconds
  setTimeout(function(){
    config.httpServer.close()
  }, 30000)
})
.catch(function(e){
  console.error(e)
})
```

Manually Reloading With MiddleWare

```javascript
var publicDir = path.join(__dirname, 'public')
var reload = require('reload')

var server = http.createServer(function(){
  midware(req,res)
})

var midware = reload.middleware(publicDir,server)

//force reload every 10 seconds of all browser websocket connections
setInterval(midware.reload, 10000);

//stop reload services after 30 seconds
setTimeout(function(){
  server.close()
}, 30000)
```

### Advanced Full Featured Example

```
require('reload')(__dirname,{
  port:8080,
  log:console.log.bind(console),
  open:true,
  message:'reload',
  hostname:'127.0.0.1',
  filter:function(pathTo, stat){
    return stat.isDirectory() || pathTo.search(/\.(js|css|html)$/)>=0
  },
  startPage:'index2.html'
})
.then(function(config){
  //force reload every 10 seconds of all browser websocket connections
  setInterval(config.reload, 10000);

  //stop reload services after 30 seconds
  setTimeout(function(){
    config.httpServer.close()
  }, 30000)  
})
.catch(function(e){
  console.error(e)
})
```


## API

### Middlware

```
var midware = reload.middleware(pathTo)

require('http').createServer(function(req,res){
  midware(req,res)
})
.listen(8080,function(){
  if(err){
    console.log(err)
  }else{
    console.log('server started')
  }
})
```

### Arguments

- `pathTo`:  Folder to watch and serve. Defaults to current dir
- `options`: 
  - `port` Number
  - `log` Function = console.log
  - `open` Boolean = true - open a browser window
  - `message` String - when port is in use, tailor prompt messages label
  - `hostname` String = localhost - This allows for custom hostnames. Defaults to localhost.
  - `filter` Function - function(pathTo,stat) when function returns true, file will be watched.
  - `port` Number = 8080 - The port to bind to. Can be set with PORT env variable as well.
  - `startPage` String - Specify a start page. Defaults to index.html.
  - `log` Function = console.log - Method to process logging info.
  - `watch` Boolean = true - Enable/disable watching files. Manual reload will be required

## Commands

Using reload as a command line application
---

There are two ways to use the command line application.

1. In a directory serving blank static HTML files or
2. In a project with a `package.json` file

Each will require different modes of installing.

In case one you should install reload globally with `npm install reload -g`. Also with reload installed globally you can go to any directory with an HTML file and use the command reload to constantly watch it and reload it while you make changes.

In case two you should install locally with `npm install --save-dev`, since this tool is to aid in development you should install it as a dev dependency.

Navigate to your html directory:

    reload -b

This will open your `index.html` file in the browser. Any changes that you make will now reload in the browser. You don't need to modify your HTML at all.

### Usage for Command Line Application

```
Usage: reload [options]

Options:

  -h, --help                        Output usage information
  -V, --version                     Output the version number
  -b, --browser                     Open in the browser automatically.
  -n, --hostname                    If -b flag is being used, this allows for custom hostnames. Defaults to localhost.
  -d, --dir [dir]                   The directory to serve up. Defaults to current dir.
  -e, --exts [extensions]           Extensions separated by commas or pipes. Defaults to html,js,css.
  -p, --port [port]                 The port to bind to. Can be set with PORT env variable as well. Defaults to 8080
  -s, --start-page [start-page]		Specify a start page. Defaults to index.html.
  -v, --verbose						Turns on logging on the server and client side. Defaults to true.
```

## License

(MIT License)

Copyright 2016, JP Richardson  <jprichardson@gmail.com>
