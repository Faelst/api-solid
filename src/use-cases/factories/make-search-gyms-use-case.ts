import { PrismaGymsRepository } from '../../repository/prisma/gyms.repository'
import { SearchGymsUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  return new SearchGymsUseCase(gymsRepository)
}
