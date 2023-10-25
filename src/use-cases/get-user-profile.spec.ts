// file deepcode ignore HardcodedSecret: <please specify a reason of ignoring this>
import { it, describe, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repository/in-memory/users.repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('GetUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  const userTest = {
    name: 'john due',
    email: 'email@test.com',
    passwordString: 'asd@12356',
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should get user profile', async () => {
    const { id } = await usersRepository.create({
      name: userTest.name,
      email: userTest.email,
      password_hash: await hash(userTest.passwordString, 4),
    })

    const { user } = await sut.execute({ userId: id })

    expect(user).toBeDefined()
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not found user profile', async () => {
    const { id } = await usersRepository.create({
      name: userTest.name,
      email: userTest.email,
      password_hash: await hash(userTest.passwordString, 4),
    })

    await expect(() =>
      sut.execute({ userId: 'invalid_id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
