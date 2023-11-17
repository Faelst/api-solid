import { FastifyInstance } from 'fastify'
import { userRoutes } from './users/routes'
import { gymsRoutes } from './gyms/routes'
import { checkInsRoutes } from './check-ins/routes'

export const appRoutes = async (app: FastifyInstance) => {
  app.register(userRoutes)
  app.register(gymsRoutes)
  app.register(checkInsRoutes)
}
