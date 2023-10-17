import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../../interfaces/users-repository.interface'

export class PrismaUsersRepository implements UsersRepository {
  create({ email, name, password_hash }: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: {
        email,
        name,
        password_hash,
      },
    })
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
