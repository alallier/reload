module.exports = function(){
  const args = Array.prototype.slice.call(arguments)
  args.unshift('\x1b[36m[reload]\x1b[0m')
  console.log.apply(console,args)
}