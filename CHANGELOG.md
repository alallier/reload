2.0.0 / 2017-02-17
------------------
Breaking Change: Include use of native Promise. NodeJs .10 is no longer supported
Removed a great amount of weight in dependencies. Package is far simpler to use and weighs far less
Removed Express as a dependency
Watching files is more intuitive and actually included outside of CLI
Better verbose logging where outside library can mandate how logging occurs
Added EADDRINUSE to cli-prompt where if port is in use, another port can be supplied to start server on another open port
Made more functional for all types of servers and not just an express server
reload package auto appends client script to all html requests

1.1.1 / 2017-01-28
------------------
Fixed undefined error log on send message. See: https://github.com/jprichardson/reload/pull/59

1.1.0 / 2016-11-12
------------------
Added client end web socket support for https. See: https://github.com/jprichardson/reload/pull/54

1.0.2 / 2016-10-31
------------------
Added error handling to websocket send. See: https://github.com/jprichardson/reload/pull/49

1.0.1 / 2016-07-15
------------------
Fixed onbeforeunload event not firing in reload-client See: https://github.com/jprichardson/reload/pull/46

1.0.0 / 2016-06-24
------------------
Added
- Two new badges to the README (code-style and npm version)
- Verbose mode as option for both Express and command line usage
- A sample app for express

Modified
- Re-wrote the README to reflect all of these changes
- Updated dependencies to their latest version’s
- Fixed race condition that caused reload to spam the server when using sockets for automatic reloading

Removed
- All delays (wait, normal, and socket) (Reload is now all automatic using web sockets (no delays at all))
- Client side sockjs web sockets (removed sockjs) (Now using native web sockets on the client side and ws on server side)

See: https://github.com/jprichardson/reload/pull/41

0.8.2 / 2016-06-24
------------------
- Fixed regression caused by Windows line endings. See: https://github.com/jprichardson/reload/pull/40

0.8.1 / 2016-06-05
------------------
- Allow reload from node server. See: https://github.com/jprichardson/reload/pull/38

0.8.0 / 2015-12-21
------------------
- fixed `hostname` flag. See: https://github.com/jprichardson/reload/pull/34
- use `exts` from command line. See: https://github.com/jprichardson/reload/pull/32

0.7.0 / 2015-10-21
------------------
- fixed `wait` flag: https://github.com/jprichardson/reload/pull/27

0.6.0 / 2015-10-12
------------------
- added `hostname/ -h` flag. See: https://github.com/jprichardson/reload/issues/14 and https://github.com/jprichardson/reload/pull/28

0.5.0 / 2015-09-28
------------------
- renamed `delay` flag to `reloadDelay`. See: https://github.com/jprichardson/reload/pull/26
- added `wait` flag. See: https://github.com/jprichardson/reload/pull/26

0.4.0 / 2015-08-17
------------------
- add `true` option to `delay` so that it waits indefinitely until server is up https://github.com/jprichardson/reload/pull/21
- express 4 routes, https://github.com/jprichardson/reload/pull/24

0.3.0 / 2015-07-17
------------------
- added option for start page. See: https://github.com/jprichardson/reload/pull/20

0.2.0 / 2015-06-29
------------------
* Added Express 4 Support

0.1.0 / 2013-09-30
------------------
* silence sockjs
* created `reload` bin that is useful for browser/html development

0.0.2 / 2013-03-14
------------------
* fixed bug that caused failure on hashbang urls
* set proper mime type on reload.js client side script

0.0.1 / 2013-03-13
------------------
* Initial release.
