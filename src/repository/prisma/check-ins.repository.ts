import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  create({ gym_id, user_id }: Prisma.CheckInUncheckedCreateInput) {
    return prisma.checkIn.create({
      data: {
        user_id,
        gym_id,
      },
    })
  }

  //   findByEmail(email: string) {
  //     return prisma.user.findUnique({
  //       where: {
  //         email,
  //       },
  //     })
  //   }

  findByUserIdOnDate(userId: string, date: Date) {
    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          lte: new Date(date).toISOString(), // "2022-01-30T00:00:00.000Z"
          gte: new Date(date).toISOString(),
        },
      },
    })
  }
}
