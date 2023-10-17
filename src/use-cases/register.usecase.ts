import { hash } from 'bcryptjs'
import { UsersRepository } from '../interfaces/users-repository.interface'
import { UserAlreadyExistsError } from './errors/user-allready-exists.error'
import { User } from '@prisma/client'

interface RegisterUserUseCaseDto {
  passwordString: string
  email: string
  name: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    passwordString,
  }: RegisterUserUseCaseDto): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(
      passwordString,
      Number(process.env.SECRET_SALT),
    )

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError(email)
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    })

    return { user }
  }
}
