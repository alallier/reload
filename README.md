reload
=======

[![Build Status](https://travis-ci.org/alallier/reload.svg?branch=master)](https://travis-ci.org/alallier/reload)
[![Build status](https://ci.appveyor.com/api/projects/status/4uuui532bpht2ff7?svg=true)](https://ci.appveyor.com/project/alallier/reload)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM version](https://img.shields.io/npm/v/reload.svg)](https://www.npmjs.com/package/reload)

Automatically refresh and reload your code in your browser when your code changes. No browser plugins required.

Why?
----

Restarting your HTTP server and refreshing your browser is annoying.

How does it work?
----------

Reload works in two different ways depending on if you're using it:

1. In an existing Express application in which it creates a server side route for reload or,
2. As a command line tool which starts its own Express application to monitor the file you're editing for changes and to serve `reload-client.js` to the browser.

Once reload-server and reload-client are connected, the client side code opens a [WebSocket](https://en.wikipedia.org/wiki/WebSocket) to the server and waits for the WebSocket to close, once it closes, reload waits for the server to come back up (waiting for a socket on open event), once the socket opens we reload the page.

Installation
---

    npm install [-g] [--save-dev] reload


Two ways to use reload
---

There are two different ways to use reload.

1. In an [Express](http://expressjs.com/) application, allowing your whole project to utilize reload when the code is altered
2. As a command line application to serve up static HTML files and be able to reload when the code is altered

Using reload in Express
---
When used with Express reload creates a new Express route for reload. When you restart the server, the client will detect the server being restarted and automatically refresh the page.

Reload can be used in conjunction with tools that allow for automatically restarting the server such as [supervisor](https://github.com/isaacs/node-supervisor) (recommended), [nodemon](https://github.com/remy/nodemon), [forever](https://github.com/nodejitsu/forever), etc.

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

app.get('/', function(req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})

var server = http.createServer(app)

// Reload code here
reload(server, app)

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
  	<h1>Reload Express Sample App12</h1>
    <!-- All you have to do is include the reload script and have it be on every page of your project -->
    <script src="/reload/reload.js"></script>
  </body>
</html>
```

**Refer to the [reload express sample app](https://github.com/jprichardson/reload/tree/master/expressSampleApp) for this working example.**

### Manually firing server-side reload events

You can manually call a reload event by calling `reload()` yourself. An example is shown below:

```javascript
reloadServer = reload(server, app);
watch.watchTree(__dirname + "/public", function (f, curr, prev) {
    // Fire server-side reload event
    reloadServer.reload();
});
```

### API for Express

```
reload(httpServer, expressApp, [verbose])
```

- `httpServer`:  The Node.js http server from the module `http`.
- `expressApp`:  The express app. It may work with other frameworks, or even with Connect. At this time, it's only been tested with Express.
- `verbose`:     If set to true, will show logging on the server and client side

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
  -v, --verbose						Turns on logging on the server and client side. Defaults to false.
```

License
---

(MIT License)

Copyright 2017

### Orginal Author:

JP Richardson  <jprichardson@gmail.com>

### Owned by:

Alexander J. Lallier <mralexlallier@gmail.com>