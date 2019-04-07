# Migration Guide

Follow this guide to help you migrate your reload use across [major versions](https://docs.npmjs.com/about-semantic-versioning).

## Table of contents

* [Version 2.x -> 3.x](#version-2x-3x)
* [Version 1.x -> 2.x](#version-1x-2x)

## Version 2.x -> 3.x

* Reload officially removed support for the `server` argument deprecated in Version 2. If you supply the server argument to reload the promise will reject and return an error.
* Reload now uses promises:
  * To call Reload you should use a `then/catch` to call reload.
      * ```javascript
        reload(app).then(function () {
          // Reload started
        }).catch(function (err) {
          // Reload did not start correctly, handle error
        })
        ```
  * If you are in an [asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) you can call Reload with [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
      * ```javascript
        async function asyncCall() {
          try {
            var reloadReturned = await reload(app)
          } catch (err) {
            // Handle error
          }
        }
        ```
* Reload no longer supports Node versions 4, 5, 6, 7, 8, or 9. Although older versions of node like version 8 may work with Reload it is recommended to use a Node version officially supported.

## Version 1.x -> 2.x

Reload dropped support for server. The only required parameter for reload is `app`.

* Upgrade with required arguments: `reload(server, app)` becomes `reload(app)`

* Upgrade with required arguments and the one optional argument: `reload(server, app, true)` becomes `reload(app, {verbose: true})`

To read more about the API breaking changes please refer to the [changelog](CHANGELOG.md#version-200).
