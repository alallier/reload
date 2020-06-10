Next version
------------------

3.1.0 / 2020-06-10
------------------

* Changed `passphrase` option from `https.p12.passphrase` to `https.passphrase` so it can be used for certAndKey configurations as well - See: https://github.com/alallier/reload/pull/251
* Tweaked CI configuration file so GitHub Actions CI will also run on pull requests - See: https://github.com/alallier/reload/pull/250
* Updated nyc from 15.0.1 to 15.1.0 - See: https://github.com/alallier/reload/pull/249
* Fix the repository URL in package.json - See: https://github.com/alallier/reload/pull/252

3.0.6 / 2020-06-10
------------------

* Contains the changes from 3.1.0 but was semantically versioned incorrectly. It is recommended not to use this version and upgrade to 3.1.0

3.0.5 / 2020-05-25
------------------

* Fixed bug where command line Reload where reload was writing to a file properly that broke on Node 14.x - See: https://github.com/alallier/reload/pull/245
* GitHub Actions - See: https://github.com/alallier/reload/pull/247
  * Added Node 14.x to GitHub Actions CI
  * Removed Node 13.x from GitHub Actions due to end of life
* Dependency Updates
  * Updated codecov from 3.6.1 to 3.7.0 - See: https://github.com/alallier/reload/pull/235 and https://github.com/alallier/reload/pull/246
  * Updated commander from 4.1.0 to 5.1.0 - See: https://github.com/alallier/reload/pull/246
  * Updated minimist from 1.2.0 to 1.2.3 (Security package-lock.json) - See: https://github.com/alallier/reload/pull/236
  * Updated mocha from 7.0.0 to 7.1.2 - See: https://github.com/alallier/reload/pull/233
  * Updated sinon from 8.0.4 to 9.0.2 - See: https://github.com/alallier/reload/pull/231 and https://github.com/alallier/reload/pull/234
  * Updated standard from 14.3.1 to 14.3.4 - See: https://github.com/alallier/reload/pull/238
  * Updated nyc from 15.0.0 to 15.0.1 - See: https://github.com/alallier/reload/pull/242
  * Updated ws from 7.2.0 to 7.3.0 - See: https://github.com/alallier/reload/pull/244

3.0.4 / 2019-01-13
------------------

* Migrated CI to GitHub Actions - See: https://github.com/alallier/reload/pull/222
* Moved sample app to a new project - See: https://github.com/alallier/reload/pull/229
* Updated nyc from 14.1.1 to 15.0.0 - See: https://github.com/alallier/reload/pull/224
* Updated sinon from 7.5.0 to 8.0.4 - See: https://github.com/alallier/reload/pull/225
* Updated mocha from 6.2.2 to 7.0.0 - See: https://github.com/alallier/reload/pull/226
* Updated commander from ~3.0.0 to ~4.1.0 - See: https://github.com/alallier/reload/pull/220
* Removed tree-kill dependency - See: https://github.com/alallier/reload/pull/223

3.0.3 / 2019-10-20
------------------

* Updated cli-color from ~1.4.0 to ~2.0.0 - See: https://github.com/alallier/reload/pull/212
* Updated open from ^6.1.0 to ^7.0.0 - See: https://github.com/alallier/reload/pull/213
* Updated mocha from 6.2.1 to 6.2.2 - See: https://github.com/alallier/reload/pull/214
* Updated ws from ~7.1.0 to ~7.2.0 - See: https://github.com/alallier/reload/pull/215

3.0.2 / 2019-10-06
------------------

* Updated express sample app's body-parser from 1.18.3 to 1.19.0 - See: https://github.com/alallier/reload/pull/193
* Updated ws from ~6.2.1 to ~7.1.0 - See: https://github.com/alallier/reload/pull/194
* Updated nyc from 14.0.0 to 14.1.1 - See: https://github.com/alallier/reload/pull/195
* Updated serve-static from ~1.13.2 to ~1.14.0 - See: https://github.com/alallier/reload/pull/196
* Updated codecov from 3.3.0 to 3.6.1 - See: https://github.com/alallier/reload/pull/197
* Updated express in reload and sample from 4.16.4 to 4.17.1 - See: https://github.com/alallier/reload/pull/198
* Updated mocha from 6.1.4 to 6.2.1 - See: https://github.com/alallier/reload/pull/203
* Updated sinon from 7.3.2 to 7.5.0 - See: https://github.com/alallier/reload/pull/204
* Updated commander from ~2.20.0 to ~3.0.0 - See: https://github.com/alallier/reload/pull/205
* Updated standard from 12.0.1 to 14.3.1 - See: https://github.com/alallier/reload/pull/206
* Use package.json files instead of `.npmignore`. See: https://github.com/alallier/reload/pull/209
* Update CONTRIBUTING.md file for collaborators to ensure the sample app's reload version matches reload upstream. See: https://github.com/alallier/reload/pull/210


3.0.1 / 2019-04-20
------------------

# Version 3.0.1

## Added

* Renovate for auto dependency updating
  * https://github.com/alallier/reload/pull/173
  * https://github.com/alallier/reload/pull/178
* Codecov for coverage reports
  * https://github.com/alallier/reload/pull/174
* npmignore
  * https://github.com/alallier/reload/pull/176
* Contributing Document
  * https://github.com/alallier/reload/pull/177

## Fixed

* Updated documentation to better reflect new API with promises
  * https://github.com/alallier/reload/pull/189
* Added reload as dependency to sample app
  * https://github.com/alallier/reload/pull/188
* Moved Mocha to dev dependencies
  * https://github.com/alallier/reload/pull/187

## Updated

* mocha to v6.1.4
  * https://github.com/alallier/reload/pull/179
* nyc to v14
  * https://github.com/alallier/reload/pull/183
* sinon to v7.3.2
  * https://github.com/alallier/reload/pull/184

3.0.0 / 2019-04-07
------------------

# Version 3.0.0

Consult [Migration Guide](MIGRATION_GUIDE.md) for help with updating from Version 2.x to 3.x

## Breaking/Removed

* Removed deprecated parameters (Reload no longer takes the server argument and will error if you provide it)
* Removed support for Node versions 4, 5, 6, 7, 8, and 9

## Breaking/Added

* Reload now returns a promise
    * Functions in the return API also return promises
        * `closerServer`
        * `startWebSocketServer`
    * Reload returns errors in promises

## Added

* Added unit tests. (See: https://github.com/alallier/reload/issues/42)
* Added coverage analyzer
    * Coverage 100% on `reload.js` file
* Added node 10 and 11 to the official supported list
* Added support for HTTPS
    * Cert and Key or PFX/P12
    * Note: This was available in version 1 and then was dropped in Version 2
* Added [sample app README](expressSampleApp/README.md) (See: https://github.com/alallier/reload/issues/45)
* Added [MIGRATION_GUIDE](MIGRATION_GUIDE.md) to help with migrating across major versions of reload
* Added force wss option
* CI jobs now use [npm ci isntall](https://docs.npmjs.com/cli/ci.html) (See: https://github.com/alallier/reload/issues/158)

## Changed

* Updates dependencies

## Closed these issues

* HTTPS - https://github.com/alallier/reload/issues/143
* Unit tests - https://github.com/alallier/reload/issues/42
* Document Fallback flag - https://github.com/alallier/reload/issues/169
* Drop Node 4 support - https://github.com/alallier/reload/issues/156
* Documentation on how to use sample app - https://github.com/alallier/reload/issues/45
* Use npm ci install - https://github.com/alallier/reload/issues/158

2.4.0 / 2018-12-02
------------------
* Added new `-f` or `--fallback` command-line flag. See: MR https://github.com/alallier/reload/pull/167. Issue: https://github.com/alallier/reload/issues/164
* Allow HTML pages to be routed with `.html`. See: MR https://github.com/alallier/reload/pull/167. Issue: https://github.com/alallier/reload/issues/166

2.3.1 / 2018-08-06
------------------

* Fixed url-parse vulnerability. See: https://github.com/alallier/reload/pull/160

2.3.0 / 2018-06-11
------------------

* Added wss to return API. See: https://github.com/alallier/reload/pull/148
* Added watch flag to command line. See: https://github.com/alallier/reload/pull/155
* Security updates
  * Updated finalhandler from `~1.0.3` to `~1.1.1`. See: https://github.com/alallier/reload/pull/154
  * Replaced [open](https://www.npmjs.com/package/open) with [opn](https://www.npmjs.com/package/opn). See: https://github.com/alallier/reload/pull/154
  * Updated serve-static from `~1.12.3` to `1.13.2`. See: https://github.com/alallier/reload/pull/154
  * Updated ws from `~3.0.0` to `~5.2.0`. See: https://github.com/alallier/reload/commit/3310a66f80e04e48247e5c2ca4a2f4f12780294f
  * Updated standard from `^10.0.2` to `^11.0.1`. See: https://github.com/alallier/reload/commit/073e91b33a00dcb37c7eb5fa7601cd71f7ea34e9

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
