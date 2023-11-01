import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repository/in-memory/check-ins.repository'
import { GetCountUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetCountUserMetricsUseCase

describe('GetCountUserMetricsUseCase', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetCountUserMetricsUseCase(checkInRepository)
  })

  it('should be able to fetch check-ins history', async () => {
    const user_id = 'user_id'

    for await (const i of [1, 2, 3]) {
      checkInRepository.create({
        gym_id: `gym_id_${i}`,
        user_id,
      })
    }

    const { checkInsCount } = await sut.execute({
      userId: user_id,
    })

    expect(checkInsCount).toEqual(3)
  })
})
