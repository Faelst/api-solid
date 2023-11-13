import { PrismaCheckInsRepository } from '../../repository/prisma/check-ins.repository'
import { FetchUserCheckInsUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()

  return new FetchUserCheckInsUseCase(checkInRepository)
}
