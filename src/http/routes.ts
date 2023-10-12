import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerUser)
}
