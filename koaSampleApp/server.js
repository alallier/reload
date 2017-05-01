const Koa = require('koa')
const KoaNunjucks = require('koa-nunjucks-2')
const http = require('http')
const path = require('path')
const reload = require('reload')

const app = new Koa()

app.use(KoaNunjucks({
  ext: 'njk',
  path: path.join(__dirname, 'templates'),
  nunjucksConfig: {
    autoescape: true
  }
}))

const router = require('koa-router')();

router.get('/', (ctx, next) => {
  return ctx.render('index');
})

app.use(router.routes())
app.use(router.allowedMethods());
const server = http.createServer(app.callback())
reload(server, app, false, { koa: true })
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log('listening on', port)
})
