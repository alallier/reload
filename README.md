reload
=======

Refresh and reload your code in your browser when your code changes. No browser plugins required. Use with Node.js if you like.



Why?
----

Restarting your Http server and refreshing your browser is annoying.



Installation
------------

    npm install [-g] [--save-dev] reload



Example for Node.js and browser development
--------------------------------------------

Use in conjunction with [supervisor](https://github.com/isaacs/node-supervisor), [nodemon](https://github.com/remy/nodemon), or [forever](https://github.com/nodejitsu/forever).

I recommend `supervisor`, since `nodedemon` time to poll for file changes is too slow and not configurable. Supervisor will feel fast. `forever` tries to do too much. Whenever I look at the docs, I get frustrated and give up.


**server.js:**
```javascript
var http = require('http');
var express = require('express');
var reload = require('reload');

var app = express()
  .use(require('connect-body-rewrite')({
    accept: function (res) {
      return res.getHeader('content-type').match(/text\/html/);
    },
    rewrite: function (body) {
      return body.replace(/<\/head>/, '<script src="/reload/reload.js"></script>');
    }
  }))
  .use(express.static('public'));

var server = http.createServer(app);

reload(server, app);

server.listen(8080, function(){
  console.log('server started on port 8080')
});

```

**public/index.html:** (very valid HTML5, watch the YouTube video)
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

hello world!

</body>
</html>
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

  -h, --help               output usage information
  -V, --version            output the version number
  -b, --browser            Open in the browser automatically.
  -d, --dir [dir]          The directory to serve up. Defaults to current dir.
  -e, --exts [extensions]  Extensions separated by commas or pipes. Defaults to html,js,css.
  -p, --port [port]        The port to bind to. Can be set with PORT env variable as well. Defaults to 8080
  -t, --time [delay]       How long (ms) should the browser wait before reconnecting? Defaults to 300 ms.

```

Navigate to your html directory:

    reload -b

this will open your `index.html` file in the browser. Any changes that you make will now reload in the browser. You don't need to modify your HTML at all.



How does it work?
-----------------

It's actually stupidly simple. We leverage `supervisor` to restart the server if any file changes. The client side keeps a websocket open, once the websocket closes, the client sets a timeout to reload in approximately 300 ms. Simple huh?



API
---

### reload(httpServer, expressApp, [timeout_millis])

- `httpServer`: The Node.js http server from the module `http`.
- `expressApp`: The express app. It may work with other frameworks, or even with Connect. At this time, it's only been tested with Express.
- `timeout_millis`: The client side refresh time in milliseconds. Default is `300`.



License
-------

(MIT License)

Copyright 2013, JP Richardson  <jprichardson@gmail.com>


