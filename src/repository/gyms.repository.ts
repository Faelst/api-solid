import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearBy({
    latitude,
    longitude,
  }: {
    latitude: number
    longitude: number
  }): Promise<Gym[]>
}
