import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '../repository/in-memory/gyms.repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('SearchGymsUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
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
      latitude: -3.761916,
      longitude: -38.519214,
      phone: 'any_phone',
    })

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 1,
    })

    expect(gyms.length).toEqual(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JS Gym' })])
  })

  it('should be able to fetch paginated gym searh', async () => {
    for (let index = 0; index < 22; index++) {
      await gymsRepository.create({
        title: `JS Gym ${index}`,
        description: 'any_desc',
        latitude: -3.761916,
        longitude: -38.519214,
        phone: 'any_phone',
      })
    }

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 2,
    })

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym 20' }),
      expect.objectContaining({ title: 'JS Gym 21' }),
    ])
  })
})
