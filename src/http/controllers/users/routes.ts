import { FastifyInstance } from 'fastify'
import { registerUser } from '@/http/controllers/users/register'
import { authenticate } from '@/http/controllers/users/authenticate'
import { profile } from '@/http/controllers/users/profile'
import { veriyJwt } from '@/http/middlewares/verify-jwt'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerUser)
  app.post('/session', authenticate)

  app.get('/me', { onRequest: [veriyJwt] }, profile)
}
