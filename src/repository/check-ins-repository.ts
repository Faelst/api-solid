import { CheckIn, Prisma, User } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  //   findByEmail(email: string): Promise<User | null>

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
