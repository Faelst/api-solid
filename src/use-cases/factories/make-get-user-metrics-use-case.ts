import { PrismaCheckInsRepository } from '../../repository/prisma/check-ins.repository'
import { GetCountUserMetricsUseCase } from '../get-user-metrics'

export function makeGetCountUserMetricsUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()

  return new GetCountUserMetricsUseCase(checkInRepository)
}
