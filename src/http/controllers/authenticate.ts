import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repository/prisma/users.repository'
import { AuthenticateUseCase } from '../../use-cases/authenticate'
import { InvalidCredentialsError } from '../../use-cases/errors/invalid-credentials.error'

export const authenticate = async (req: FastifyRequest, rep: FastifyReply) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  let user

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new AuthenticateUseCase(usersRepository)

    user = await registerUseCase.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return rep.status(400).send({
        message: error.message,
      })
    }

    throw error
  }

  return rep.status(200).send(user)
}
