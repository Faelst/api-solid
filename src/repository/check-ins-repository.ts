import { CheckIn, Prisma, User } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<CheckIn[] | null>
  countByUserId(userId: string): Promise<number>
  findById(checkId: string): Promise<CheckIn | null>
  save(checkIn: CheckIn): Promise<CheckIn>
}
