import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '../repository/in-memory/check-ins.repository'
import { InMemoryGymsRepository } from '../repository/in-memory/gyms.repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'
import { MaxDistanceError } from './errors/max-distance.error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckInUseCase', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'any_gym_id_01',
      title: 'any_title',
      description: 'any_desc',
      latitude: -3.761916,
      longitude: -38.519214,
      phone: 'any_phone',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'any_gym_id_01',
      userId: 'any_user_id_01',
      userLatitude: -3.761916,
      userLongitude: -38.519214,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8 - 3, 0, 0))

    await sut.execute({
      gymId: 'any_gym_id_01',
      userId: 'user_id_01',
      userLatitude: -3.761916,
      userLongitude: -38.519214,
    })

    expect(
      async () =>
        await sut.execute({
          gymId: 'any_gym_id_01',
          userId: 'user_id_01',
          userLatitude: -3.761916,
          userLongitude: -38.519214,
        }),
    ).rejects.toBeInstanceOf(   )
  })

  it('should not be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8 - 3, 0, 0))

    await sut.execute({
      gymId: 'any_gym_id_01',
      userId: 'user_id_01',
      userLatitude: -3.761916,
      userLongitude: -38.519214,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8 - 3, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'any_gym_id_01',
      userId: 'user_id_01',
      userLatitude: -3.761916,
      userLongitude: -38.519214,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'any_gym_id_2',
      title: 'any_title_2',
      description: 'any_desc_2',
      latitude: new Decimal(-3.761916),
      longitude: new Decimal(-38.519214),
      phone: 'any_phone_2',
    })

    expect(() =>
      sut.execute({
        gymId: 'any_gym_id_2',
        userId: 'any_user_id_2',
        userLatitude: 36.133214,
        userLongitude: -115.1903,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
