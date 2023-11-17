import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { veriyJwt } from './middlewares/verify-jwt'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerUser)
  app.post('/session', authenticate)

  app.get('/me', { onRequest: [veriyJwt] }, profile)
}
