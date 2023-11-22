import { FastifyInstance } from 'fastify'
import { registerUser } from '@/http/controllers/users/register'
import { authenticate } from '@/http/controllers/users/authenticate'
import { profile } from '@/http/controllers/users/profile'
import { veriyJwt } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'

export const userRoutes = async (app: FastifyInstance) => {
  app.patch('/token/refresh', refresh)
  app.post('/users', registerUser)
  app.post('/session', authenticate)
  app.get('/me', { onRequest: [veriyJwt] }, profile)
}
