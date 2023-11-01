import { CheckInsRepository } from '../repository/check-ins-repository'
import { GymsRepository } from '../repository/gyms.repository'

interface GetCountUserMetricsUseCaseRequest {
  userId: string
}

interface GetCountUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetCountUserMetricsUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetCountUserMetricsUseCaseRequest): Promise<GetCountUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
