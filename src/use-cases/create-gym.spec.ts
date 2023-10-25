import { it, describe, expect, test, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-allready-exists.error'
import { InMemoryGymsRepository } from '../repository/in-memory/gyms.repository'
import { CreateGymUseCase } from './create-gym'
import { Decimal } from '@prisma/client/runtime/library'

describe('RegisterUseCase', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: CreateGymUseCase

  const gymPayload = {
    title: 'any_title',
    description: 'any_desc',
    latitude: -3.761916,
    longitude: -38.519214,
    phone: 'any_phone',
  }

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should create user', async () => {
    const { gym } = await sut.execute(gymPayload)

    expect(gym).toBeDefined()
    expect(gym.id).toEqual(expect.any(String))
  })
})
