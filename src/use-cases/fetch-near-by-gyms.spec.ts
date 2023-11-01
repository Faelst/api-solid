import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '../repository/in-memory/gyms.repository'
import { FetchNearByGymsUseCase } from './fetch-near-by-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsUseCase

describe('FetchNearByGymsUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsUseCase(gymsRepository)
  })

  it('should be able to fetch near by gyms', async () => {
    await gymsRepository.create({
      title: 'JS Gym',
      description: 'any_desc',
      latitude: -3.761916,
      longitude: -38.519214,
      phone: 'any_phone',
    })

    await gymsRepository.create({
      title: 'TS Gym',
      description: 'any_desc',
      latitude: -23.761916,
      longitude: -38.519214,
      phone: 'any_phone',
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.761666,
      userLongitude: -38.519999,
    })

    expect(gyms.length).toEqual(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JS Gym' })])
  })
})
