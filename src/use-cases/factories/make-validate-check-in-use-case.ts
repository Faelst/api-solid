import { PrismaCheckInsRepository } from '../../repository/prisma/check-ins.repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()

  return new ValidateCheckInUseCase(checkInRepository)
}
