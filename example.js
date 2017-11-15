const hapi = require('hapi')
const laabr = require('./src')

const server = hapi.server({ port: 3000, host: 'localhost' })

server.route([
  {
    method: '*',
    path: '/response',
    handler (req, reply) {
      reply('hello world')
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler (req, reply) {
      reply(new Error('foobar'))
    }
  }
])

process.on('SIGINT', () => {
  server.stop().then((err) => {
    process.exit((err) ? 1 : 0)
  })
})

server.register({
  register: laabr.plugin,
  options: {
    formats: { onPostStart: ':time :start :level :message' },
    tokens: { start: () => '[start]' },
    indent: 0
  }
})
.then(() => server.start())
.catch(console.error)

server.log('info', 'did you mean "foobar"?')
