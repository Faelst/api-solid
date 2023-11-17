import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetCountUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export const metrics = async (req: FastifyRequest, rep: FastifyReply) => {
  const getCountUserMetricsUseCase = makeGetCountUserMetricsUseCase()

  const { checkInsCount } = await getCountUserMetricsUseCase.execute({
    userId: req.user.sub,
  })

  return rep.status(200).send({
    checkInsCount,
  })
}
