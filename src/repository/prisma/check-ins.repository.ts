import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  create({ gym_id, user_id }: Prisma.CheckInUncheckedCreateInput) {
    return prisma.checkIn.create({
      data: {
        user_id,
        gym_id,
      },
    })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          lte: startOfTheDay.toDate(),
          gte: endOfTheDay.toDate(),
        },
      },
    })
  }

  countByUserId(userId: string): Promise<number> {
    return prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }

  async findById(checkId: string): Promise<CheckIn | null> {
    return prisma.checkIn.findUnique({
      where: { id: checkId },
    })
  }

  findManyByUserId(
    userId: string,
    page: number,
    limit = 20,
  ): Promise<CheckIn[] | null> {
    return prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: limit,
      skip: (page - 1) * limit,
    })
  }

  save(checkIn: CheckIn): Promise<CheckIn> {
    return prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    })
  }
}
