import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../../use-cases/errors/invalid-credentials.error'
import { makeAuthenticateUseCase } from '../../use-cases/factories/make-authenticate-use-case'

export const authenticate = async (req: FastifyRequest, rep: FastifyReply) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  let user

  try {
    const registerUseCase = makeAuthenticateUseCase()

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
