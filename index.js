module.exports = function (app, opts) {
  var reload = require('./lib/reload')

  return reload(app, opts)
}
