reload
=======

Refresh and reload your code in your browser when your code changes. No browser plugins required. Use with Node.js if you like.



Why?
----

Restarting your Http server and refreshing your browser is annoying.

Express version support
-----------------------

To use reload with Express 4 support, use reload version `^0.2.0`.

To use reload with Express 3 support, use reload version `~0.1.0`.

Installation
------------

    npm install [-g] [--save-dev] reload



Example for Node.js and browser development
--------------------------------------------

Use in conjunction with [supervisor](https://github.com/isaacs/node-supervisor), [nodemon](https://github.com/remy/nodemon), or [forever](https://github.com/nodejitsu/forever).

I recommend `supervisor`, since `nodedemon` time to poll for file changes is too slow and not configurable. Supervisor will feel fast. `forever` tries to do too much. Whenever I look at the docs, I get frustrated and give up.

Using reload with Express 4
---------------------------

*Reload version `^0.2.0`.*

**server.js:**
```javascript
var express = require('express')
  , http = require('http')
  , path = require('path')
  , reload = require('reload')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
 
var app = express()
 
var publicDir = path.join(__dirname, '')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded 

app.get('/', function(req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})
 
var server = http.createServer(app)

//reload code here
//optional reload delay and wait argument can be given to reload, refer to [API](https://github.com/jprichardson/reload#api) below
reload(server, app, [reloadDelay], [wait])
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});
```

Using reload with Express 3
---------------------------

*Reload version `~0.1.0`.*

**server.js:**
```javascript
var express = require('express')
  , http = require('http')
  , path = require('path')
  , reload = require('reload')

var app = express()

var publicDir = path.join(__dirname, 'public')

app.configure(function() {
  app.set('port', process.env.PORT || 3000)
  app.use(express.logger('dev'))
  app.use(express.bodyParser()) //parses json, multi-part (file), url-encoded
  app.use(app.router) //need to be explicit, (automatically adds it if you forget)
  app.use(express.static(publicDir)) //should cache static assets
})

app.get('/', function(req, res) {
  res.sendfile(path.join(publicDir, 'index.html'))
})

var server = http.createServer(app)

//reload code here
//optional reload delay and wait argument can be given to reload, refer to [API](https://github.com/jprichardson/reload#api) below
reload(server, app, [reloadDelay], [wait])

server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});
```

**public/index.html:** (very valid HTML5, watch the YouTube video)
```html
<!-- 
  watch this: http://www.youtube.com/watch?v=WxmcDoAxdoY 
-->
<!doctype html>
<meta charset="utf-8">
<title>My sweet app!</title>

<!-- all you have to do is include the reload script -->
<script src="/reload/reload.js"></script>

<h1>Hello!</h1>
```

install supervisor:
```
npm install -g supervisor
```

reload on any html or js file change:
```
supervisor -e 'html|js' node server.js
```



Example for browser development only
-------------------------------------

You should install `reload` globally like `npm install -g reload`. Then you can use the `reload` command in your directory without modifying any of your HTML.

Usage:

```

Usage: reload [options]

Options:


  -h, --help                         Output usage information
  -V, --version                      Output the version number
  -b, --browser                      Open in the browser automatically.
  -h, --hostname                     If -b flag is being used, this allows for custom hostnames. Defaults to localhost.
  -d, --dir [dir]                    The directory to serve up. Defaults to current dir.
  -e, --exts [extensions]            Extensions separated by commas or pipes. Defaults to html,js,css.
  -p, --port [port]                  The port to bind to. Can be set with PORT env variable as well. Defaults to 8080
  -r, --reload-delay [reload-delay]  The client side refresh time in milliseconds. Default is `300`. If wait is specified as true (which is by default, see below) this delay becomes the delay of how long the pages waits to reload after the socket is reopened.
  -w, --wait [wait]                  Specify true, if you would like reload to wait until the server comes back up before reloading the page. Defaults to true
  -s, --start-page [start-page]      Specify a start page. Defaults to index.html.


```

Navigate to your html directory:

    reload -b

this will open your `index.html` file in the browser. Any changes that you make will now reload in the browser. You don't need to modify your HTML at all.



How does it work?
-----------------

It's actually stupidly simple. We leverage `supervisor` to restart the server if any file changes. The client side keeps a websocket open, once the websocket closes, the client sets a timeout to reload in approximately 300 ms (or any other time you'd like, refer to [API](https://github.com/jprichardson/reload#api) below). Simple huh?



API
---

### reload(httpServer, expressApp, [reloadDelay], [wait])

- `httpServer`:  The Node.js http server from the module `http`.
- `expressApp`:  The express app. It may work with other frameworks, or even with Connect. At this time, it's only been tested with Express.
- `reloadDelay`: The client side refresh time in milliseconds. Default is `300`. If wait is specified as true (which it is be default, see below) this delay becomes the delay of how long the pages waits to reload after the socket is reopened.
- `wait`:        If wait is specified as true reload will wait until the server comes back up before reloading the page. Defaults to true.



License
-------

(MIT License)

Copyright 2013, JP Richardson  <jprichardson@gmail.com>

