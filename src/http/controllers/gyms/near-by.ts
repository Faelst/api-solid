import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchNearByGymsUseCase } from '../../../use-cases/factories/make-fetch-near-by-gyms-use-case'

export const nearBy = async (req: FastifyRequest, rep: FastifyReply) => {
  const nearByGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearByGymsQuerySchema.parse(req.query)

  const fetchNearByGymsUseCase = makeFetchNearByGymsUseCase()

  const { gyms } = await fetchNearByGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return rep.status(200).send({
    gyms,
  })
}
