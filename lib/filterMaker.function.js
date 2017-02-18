module.exports = function(){
  var argPipes = 'js|css|html'

  if(arguments.length){
    argPipes = Array.prototype.slice.call(arguments).join('|')
  }
  var regx = new RegExp('\\.('+argPipes+')$')

  return function(pathTo, stat){
    return stat.isDirectory() || pathTo.search(regx)>=0
  }
}