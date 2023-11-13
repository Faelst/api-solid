import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { GymsRepository } from '../gyms.repository'
import { prisma } from '../../lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym> {
    return prisma.gym.create({ data })
  }

  findById(id: string): Promise<Gym | null> {
    return prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  searchMany(query: string, page: number): Promise<Gym[]> {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  findManyNearBy({
    latitude,
    longitude,
  }: {
    latitude: number
    longitude: number
  }): Promise<Gym[]> {
    return prisma.$queryRaw<Gym[]>`
        SELECT 
            * 
        FROM gyms
        WHERE 
            ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
  }
}
