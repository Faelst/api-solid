import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

export const registerUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(req.body)

  const passwordHash = await hash(password, 4)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    return rep.status(409).send()
  }

  await prisma.user.create({
    data: {
      email,
      name,
      password_hash: passwordHash,
    },
  })

  return rep.status(201).send()
}
