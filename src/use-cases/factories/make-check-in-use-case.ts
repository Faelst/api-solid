import { PrismaCheckInsRepository } from '../../repository/prisma/check-ins.repository'
import { PrismaGymsRepository } from '../../repository/prisma/gyms.repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()

  return new CheckInUseCase(checkInsRepository, gymsRepository)
}
