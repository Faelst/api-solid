//   file deepcode ignore HardcodedSecret: <please specify a reason of ignoring this>
import { it, describe, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repository/in-memory/users.repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

describe('AuthenticateUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUseCase

  const userCredentialsTest = {
    name: 'john due',
    email: 'email@test.com',
    password: 'asd@12356',
    created_at: new Date(),
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      ...userCredentialsTest,
      password_hash: await hash(userCredentialsTest.password, 4),
    })

    const { user } = await sut.execute(userCredentialsTest)

    expect(user).toBeDefined()
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate, when not found user', async () => {
    await expect(() => sut.execute(userCredentialsTest)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to authenticate, when be user invalid password', async () => {
    await usersRepository.create({
      ...userCredentialsTest,
      password_hash: await hash(userCredentialsTest.password, 4),
    })

    await expect(() =>
      sut.execute({
        email: userCredentialsTest.email,
        password: 'invalid_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
