import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '../../../use-cases/factories/make-create-gym-use-case'

export const create = async (req: FastifyRequest, rep: FastifyReply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    phone: z.string(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, latitude, longitude, phone } =
    createGymBodySchema.parse(req.body)

  const createGymUseCase = makeCreateGymUseCase()

  const { gym } = await createGymUseCase.execute({
    title,
    description,
    latitude,
    longitude,
    phone,
  })

  return rep.status(201).send({
    gym,
  })
}
