reload
=======

[![build status](https://api.travis-ci.org/jprichardson/reload.svg)](http://travis-ci.org/jprichardson/reload)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM version](https://img.shields.io/npm/v/reload.svg?style=flat-square)](https://www.npmjs.com/package/reload)

Automatically refresh and reload your code in your browser when your code changes. No browser plugins required.

Why?
----

Restarting your HTTP server and refreshing your browser is annoying.

How does it work?
----------

Reload works in three different ways depending on if you're using it:

1. In a NodeJs process in which either a reload-server
2. You can use reload middleware to "attach" reload to a existing server route
3. As a command line tool which starts its own Server to monitor the file(s) you're editing for changes and to serve `reload-client.js` to the browser.

Once reload-server and reload-client are connected, the client side code opens a [WebSocket](https://en.wikipedia.org/wiki/WebSocket) to the server and waits for the WebSocket to close, once it closes, reload waits for the server to come back up (waiting for a socket on open event), once the socket opens we reload the page.

### Upgrading from v1 to v2
The following major changes have taken place

- Faster by using updated NodeJs ECMA6 syntax
- Removed a great amount of weight in dependencies. Package is far simplier to use and weighs far less
- Removed Express as a dependency
- Watching files is more intuitive and actually included outside of CLI
- Better verbose logging where outside library can mandate how logging occurs
- Added EADDRINUSE to cli-prompt where if port is in use, another port can be supplied to start server on another open port
- Made more functional for all types of servers and not just an express server

> Express app v1
```
var app = express()
var publicDir = path.join(__dirname, 'public')

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})

var server = http.createServer(app)

reload(server, app)
```

> Express app v2
```
var app = express()
var publicDir = path.join(__dirname, 'public')

app.use(reload.middleware(publicDir))

http.createServer(app)
```


Installation
---

    npm install [-g] [--save-dev] reload


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

**`server.js`:**
```javascript
var reload = require('reload')
var publicDir = path.join(__dirname, 'public')
reload(publicDir,{port:3000})
```

### Express Example

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

// Reload code here
app.use( reload(publicDir) )

server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});
```

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

### Manually firing server-side reload events

You can manually call a reload event by calling `reload()` yourself. An example is shown below:

```javascript
var publicDir = path.join(__dirname, 'public')
var reload = require('reload')
var server = http.createServer( reload.middleware(publicDir) )

reloadServer = reload.reloadSocketByHttp(publicDir, server);

watch.watchTree(__dirname + "/public", function (f, curr, prev) {
    // Fire server-side reload event
    reloadServer();
});
```

### API for Express

```
reload.middleware(pathTo, options)
```

- `pathTo`:  Folder to watch and serve. Defaults to current dir
- `options`: 
  - `port` Number
  - `log` Function = console.log
  - `open` Boolean = true - open a browser window
  - `message` String - when port is in use, tailor prompt messages label
  - `open` Boolean = true - Open in the browser automatically.
  - `hostname` String = localhost - This allows for custom hostnames. Defaults to localhost.
  - `filter` Function - function(pathTo,stat) when function returns true, file will be watched.
  - `port` Number = 8080 - The port to bind to. Can be set with PORT env variable as well.
  - `startPage` String - Specify a start page. Defaults to index.html.
  - `log` Function = console.log - Method to process logging info.


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

License
---

(MIT License)

Copyright 2016, JP Richardson  <jprichardson@gmail.com>
