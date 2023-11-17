import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repository/in-memory/check-ins.repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('FetchUserCheckInsHistoryUseCase', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch check-ins history', async () => {
    const user_id = 'user_id'
    const checkInsExpect = []
    for (const i of [1, 2, 3]) {
      checkInsExpect.push(
        await checkInRepository.create({
          gym_id: `gym_id_${i}`,
          user_id,
        }),
      )
    }

    const { checkIns } = await sut.execute({
      userId: user_id,
    })

    expect(checkIns).length(3)
    // expect(checkIns).toEqual(checkInsExpect)
  })

  it('should be able to fetch paginated check-ins history', async () => {
    const user_id = 'user_id'

    for (let i = 0; i < 50; i++) {
      checkInRepository.create({
        gym_id: `gym_id_${i}`,
        user_id,
      })
    }

    const { checkIns } = await sut.execute({
      userId: user_id,
      limit: 2,
      page: 2,
    })

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_id_3' }),
      expect.objectContaining({ gym_id: 'gym_id_4' }),
    ])
  })
})
