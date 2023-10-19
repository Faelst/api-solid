import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'
import { authenticate } from './controllers/authenticate'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerUser)

  app.post('/sessions', authenticate)
}
