import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticationUser = async (app: FastifyInstance) => {
  const newUser = {
    name: 'valid_any_name',
    email: 'valid_any@mail.com',
    password: 'valid_any_password',
  }

  await request(app.server).post('/users').send(newUser)

  const sessionResponse = await request(app.server)
    .post('/session')
    .send(newUser)

  const { token } = sessionResponse.body

  return {
    user: newUser,
    token,
  }
}
