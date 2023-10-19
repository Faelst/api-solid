import { it, describe, expect, test, beforeEach } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repository/in-memory/users.repository'
import { UserAlreadyExistsError } from './errors/user-allready-exists.error'

describe('RegisterUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: RegisterUseCase

  const userTest = {
    name: 'john due',
    email: 'email@test.com',
    passwordString: 'asd@12356',
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should create user', async () => {
    console.log(sut)
    const { user } = await sut.execute(userTest)

    expect(user).toBeDefined()
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon register', async () => {
    const { user } = await sut.execute(userTest)

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

    await sut.execute(userTest)

    await expect(() => sut.execute(userTest)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
