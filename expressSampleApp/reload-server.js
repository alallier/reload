var reload = require('../lib/reload')//replace with just reload for package use
var path = require('path')
var publicDir = path.join(__dirname, 'public')

reload(publicDir).then(function(){
  console.log('Web server listening on port ' + app.get('port'))
})
