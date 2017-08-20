2.2.2 / 2017-08-20
------------------

Fixed bug that caused HTML files to not be served when using directory flag (reload command line). See: https://github.com/alallier/reload/pull/139

2.2.1 / 2017-08-05
------------------

Fixed regression causing reload command line to only serve HTML files. See: https://github.com/alallier/reload/pull/134

2.2.0 / 2017-07-27
------------------

* Dropped express as a dependency (in reload command line). Reload now uses a vanilla node http server to achieve the same result. This update for the command line offers no changes to the end user and simply modifies the underlying code. See: https://github.com/alallier/reload/pull/132

2.1.0 / 2017-07-25
------------------

* Added the ability to have the WebSocket server start wait. (For more information read about the `webSocketServerWaitStart` [parameter](README.md#parameters)) See: https://github.com/alallier/reload/pull/130

2.0.1 / 2017-07-20
------------------

* Adjusted wording in README. See: https://github.com/alallier/reload/pull/123
* Removed MacOS Travis Building. See: https://github.com/alallier/reload/pull/125
* Fixed bug when running command line on port 80. See: https://github.com/alallier/reload/pull/128

2.0.0 / 2017-07-09
------------------

See V2.0.0 PR https://github.com/alallier/reload/pull/118

### Added
* Added object based parameters (Issue [#77](https://github.com/alallier/reload/issues/77) / Originally solved in PR [#101](https://github.com/alallier/reload/pull/101) and refactored in [#104](https://github.com/alallier/reload/pull/104))
* Added port configuration (Issue [#60](https://github.com/alallier/reload/issues/60) / Originally solved in PR [#68](https://github.com/alallier/reload/pull/68) and refactored in [#104](https://github.com/alallier/reload/pull/104))
* Added timestamp to reload command line reloading (Issue [#7](https://github.com/alallier/reload/issues/7) / PR [#78](https://github.com/alallier/reload/pull/78))
* Added node 8 support (Issue [#106](https://github.com/alallier/reload/issues/106) / PR [#119](https://github.com/alallier/reload/pull/119))
* Added table of contents to README (Issue [#103](https://github.com/alallier/reload/issues/103) / PR [#105](https://github.com/alallier/reload/pull/105))
* Added return API to README (PR [#121](https://github.com/alallier/reload/pull/121))

### Modified
* Abstracted reload call to an index.js file. Index file now calls `reload.js` source file. This is to abstract the reload command line calling with a third argument that is now private and not apart of the public API (PR [#117](https://github.com/alallier/reload/pull/117))
* Update dependencies to latest and add package-lock.json files (PR [#109](https://github.com/alallier/reload/pull/109))
* Audited and refactored return API (Issue [#120](https://github.com/alallier/reload/issues/120) / PR [#121](https://github.com/alallier/reload/pull/121))

### Removed
* Drop support for server and just use ports (Issue [#102](https://github.com/alallier/reload/issues/102) / PR [#104](https://github.com/alallier/reload/pull/104))
* Removed support of node 0.1 and 0.12 (Issue [#73](https://github.com/alallier/reload/issues/73) / PR [#86](https://github.com/alallier/reload/pull/86))
* Separate server and app initialization into two parts. (This was originally fixed in PR [#71](https://github.com/alallier/reload/pull/71) but was reversed in PR [#104](https://github.com/alallier/reload/pull/104) when the decision to drop server was made.)

### API Breaking Changes
This version makes breaking changes to the reload API. The only required argument to reload now is `app`. This makes reload a lot [easier](https://github.com/jprichardson/reload/pull/104) to use. Reload takes a maximum of two arguments `app` and an `opts` (options) object with the following optional parameters, `port`, `route`, and `verbose`. Reload runs on default port `9856` unless otherwise specified in the `opts` object.

#### How to upgrade from Version 1 to Version 2
Before Version 2 reload always attached to your server's port by passing the server in a argument to reload. We have now dropped support for server and reload runs on ports only. Reload now has one required parameter `app` and one optional parameter `opts` an object of reload options. Below are two upgrade examples for the only two possible 1.x configurations.

Upgrade with required arguments: `reload(server, app)` becomes `reload(app)`

Upgrade with both required arguments and the one optional argument: `reload(server, app, true)` becomes `reload(app, {verbose: true})`

It is important to note that reload **only** uses ports now. So upgrading using the examples above will have reload run on it's default port `9856`. If you want to run reload on a different port you need to specify a port in the `opts` object like: `reload(app, {port: 9852})`

Most people can just use the default settings, allowing `reload(app)` to work in most cases.

Please refer to the full API in the [README](README.md#api-for-express).

1.1.7 / 2017-06-28
------------------
Repository ownership was transfered from jprichardson to alallier

- Updated Travis badge after ownership change. See: https://github.com/alallier/reload/pull/116
- Updated AppVeyor badge after ownership change. See: https://github.com/alallier/reload/pull/112
- Updated README after owernship change. See: https://github.com/alallier/reload/pull/115
- Changed style of npm badge to match the others. See: https://github.com/alallier/reload/pull/111

1.1.6 / 2017-06-18
------------------
Add Mac building in Travis. See https://github.com/jprichardson/reload/pull/98

1.1.5 / 2017-05-13
------------------
Fixed standard call so that our bin file also got tested. See https://github.com/jprichardson/reload/pull/85

1.1.4 / 2017-05-13
------------------
Added AppVeyor to build our tests in an Windows environment. See https://github.com/jprichardson/reload/pull/92

1.1.3 / 2017-04-28
------------------
Upgrade Standard to `~10.0.2` in order for the build to pass node `0.1` and `0.12`
Also removed depricated `fs.exists` and replaced with `fs.access`
See: https://github.com/jprichardson/reload/pull/75

1.1.2 / 2017-04-16
------------------
Fix multiple websockets at once when using reload.reload(); See: https://github.com/jprichardson/reload/pull/57

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
