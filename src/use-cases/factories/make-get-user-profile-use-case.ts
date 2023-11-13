import { PrismaUsersRepository } from '../../repository/prisma/users.repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()

  return new GetUserProfileUseCase(usersRepository)
}
