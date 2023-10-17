import { it, describe, expect, test } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { PrismaUsersRepository } from '../repository/prisma/users.repository'
import { compare } from 'bcryptjs'
import { UsersRepository } from '../interfaces/users-repository.interface'
import { InMemoryUsersRepository } from '../repository/in-memory/users.repository'
import { UserAlreadyExistsError } from './errors/user-allready-exists.error'

describe('RegisterUseCase', () => {
  it('should create user', async () => {
    const userTest = {
      name: 'john due',
      email: 'email@test.com',
      passwordString: 'asd@12356',
    }

    const usersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute(userTest)

    expect(user).toBeDefined()
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon register', async () => {
    const userTest = {
      name: 'john due',
      email: 'email@test.com',
      passwordString: 'asd@12356',
    }

    const usersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute(userTest)

    const isPasswordCorrectlyHash = await compare(
      userTest.passwordString,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHash).toBeTruthy()
  })

  it('should not be register with same email twice', async () => {
    const userTest = {
      name: 'john due',
      email: 'email@test.com',
      passwordString: 'asd@12356',
    }

    const usersRepository = new InMemoryUsersRepository()

    const registerUseCase1 = new RegisterUseCase(usersRepository)

    await registerUseCase1.execute(userTest)

    await expect(() =>
      registerUseCase1.execute(userTest),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
