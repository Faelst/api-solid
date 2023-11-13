import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repository/in-memory/check-ins.repository'
import { InMemoryGymsRepository } from '../repository/in-memory/gyms.repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { InMemoryUsersRepository } from '../repository/in-memory/users.repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Gym, User } from '@prisma/client'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let sut: ValidateCheckInUseCase

let gym: Gym
let user: User

describe('ValidateCheckInUseCase', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    gym = await gymsRepository.create({
      id: 'any_gym_id_01',
      title: 'any_title',
      description: 'any_desc',
      latitude: -3.761916,
      longitude: -38.519214,
      phone: 'any_phone',
    })

    user = await userRepository.create({
      name: 'john due',
      email: 'email@test.com',
      password_hash: await hash('any_password', 4),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkInExpected = await checkInRepository.create({
      gym_id: gym.id,
      user_id: user.id,
    })

    const { checkIn } = await sut.execute({ checkInId: checkInExpected.id })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.id).toEqual(checkInExpected.id)
    expect(checkIn.validated_at).not.toBeNull()
  })

  it('should be able to check in', async () => {
    expect(() =>
      sut.execute({ checkInId: 'INVALID_ID' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkIn = await checkInRepository.create({
      gym_id: gym.id,
      user_id: user.id,
    })

    const twentyTimeByTime = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyTimeByTime)

    expect(() => sut.execute({ checkInId: checkIn.id })).rejects.toBeInstanceOf(
      LateCheckInValidationError,
    )
  })
})
