const prompt = require('prompt')

/** You must run .stop when done with prompts */
module.exports = function promisePrompt(scheme, options){
  options = options || {}
  options.message = options.message || 'reload'
  return new Promise(function(res,rej){
    prompt.message = options.message
    prompt.start()
    prompt.get(scheme, function(err, result){
      err ? rej(err) : res(result)
    })
  })
}

module.exports.stop = function(){
  if(prompt.stop)prompt.stop()
}

module.exports.prompt = prompt