import fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'

const server = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
})

async function start() {
  try {
    await server.register(cors, {
      origin: true,
    })

    await server.register(websocket)

    server.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    })

    server.register(async function (fastify) {
      fastify.get('/ws', { websocket: true }, (socket, _request) => {
        socket.on('message', (message) => {
          const data = JSON.parse(message.toString())
          server.log.info({ msg: 'Received message', data })

          socket.send(
            JSON.stringify({
              type: 'echo',
              data: data,
              timestamp: Date.now(),
            }),
          )
        })

        socket.on('close', () => {
          server.log.info('Client disconnected')
        })
      })
    })

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001
    await server.listen({ port, host: '0.0.0.0' })

    server.log.info(`Server listening on http://localhost:${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
