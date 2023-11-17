import { PrismaCheckInsRepository } from '../../repository/prisma/check-ins.repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()

  return new FetchUserCheckInsHistoryUseCase(checkInRepository)
}
