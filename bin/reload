#!/usr/bin/env node

var program = require('commander')
  , supervisor = require('supervisor')
  , path = require('path')
  , ON_DEATH = require('death')
  , os = require('os')
  , fs = require('fs')
  , clc = require('cli-color')

program.version(require('../package.json').version)
  .option('-b, --browser', 'Open in the browser automatically.')
  .option('-h, --hostname [hostname]', 'If -b flag is being used, this allows for custom hostnames. Defaults to localhost.', 'localhost')
  .option('-d, --dir [dir]', 'The directory to serve up. Defaults to current dir.', process.cwd())
  .option('-e, --exts [extensions]', 'Extensions separated by commas or pipes. Defaults to html,js,css.', 'html|js|css')
  .option('-p, --port [port]', 'The port to bind to. Can be set with PORT env variable as well. Defaults to 8080', '8080')
  .option('-r, --reload-delay [reload-delay]', 'How long (ms) should the server wait before refreshing the page? Defaults to 300 ms. If -w is set to true, this delay becomes how long the page should wait to reload after the socket open.', '300')
  .option('-w, --wait [wait]', 'Specify whether or not reload should wait until the server comes back up before reloading the page. Defaults to true', 'true') 
  .option('-s, --start-page [start-page]', 'Specify a start page. Defaults to index.html', 'index.html')
  .parse(process.argv)

var runFile = path.join(os.tmpdir(), 'reload-' + Math.random().toString().slice(2))
var serverFile = path.join(__dirname, '../lib/reload-server.js')

if (program.exts.indexOf(','))
  program.exts = program.exts.replace(/\,/g,'|') //replace comma for pipe, that's what supervisor likes

var args = ['-e', 'html|js|css', '-q', '--', serverFile, program.port, program.dir, !!program.browser, program.hostname, runFile, program.reloadDelay, program.wait, program.startPage]
supervisor.run(args)

console.log("\n  Reload web server:")
console.log("    listening on port " + clc.blue.bold(program.port))
console.log("    monitoring dir " + clc.green.bold(program.dir))

