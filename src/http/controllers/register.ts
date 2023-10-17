import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '../../use-cases/register.usecase'
import { PrismaUsersRepository } from '../../repository/prisma/users.repository'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-allready-exists.error'

export const registerUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(req.body)

  let newUser

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    newUser = await registerUseCase.execute({
      email,
      name,
      passwordString: password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return rep.status(409).send({
        message: error.message,
      })
    }

    throw error
  }

  return rep.status(201).send(newUser)
}
