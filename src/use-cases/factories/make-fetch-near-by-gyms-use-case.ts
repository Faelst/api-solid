import { PrismaGymsRepository } from '../../repository/prisma/gyms.repository'
import { FetchNearByGymsUseCase } from '../fetch-near-by-gyms'

export function makeFetchNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  return new FetchNearByGymsUseCase(gymsRepository)
}
