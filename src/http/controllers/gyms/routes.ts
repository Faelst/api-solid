import { FastifyInstance } from 'fastify'
import { veriyJwt } from '../../middlewares/verify-jwt'
import { create } from './create'
import { search } from './search'
import { nearBy } from './near-by'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', veriyJwt)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.get('/gyms/search', search)
  app.get('/gyms/near-by', nearBy)
}
