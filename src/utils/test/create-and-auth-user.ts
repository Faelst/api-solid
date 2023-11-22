import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export const createAndAuthenticationUser = async (
  app: FastifyInstance,
  isAdmin = false,
) => {
  const newUser = {
    name: 'valid_any_name',
    email: 'valid_any@mail.com',
    password_hash: await hash('valid_any_password', 3),
    role: isAdmin ? 'ADMIN' : 'MEMBER',
  } as any

  await prisma.user.create({ data: newUser })

  const sessionResponse = await request(app.server).post('/session').send({
    email: 'valid_any@mail.com',
    password: 'valid_any_password',
  })

  const { token } = sessionResponse.body

  return {
    user: newUser,
    token,
  }
}
