import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { appRoutes } from '@/http/controllers/routes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})
app.register(cookie)
app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Criar logs de erro para PROD
  }

  return reply.status(500).send({
    message: 'Internal Server Error, try later',
  })
})
