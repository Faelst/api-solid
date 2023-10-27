import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckInsRepository } from '../repository/check-ins-repository'

interface FetchUserCheckInsUseCaseRequest {
  userId: string
  limit?: number
  page?: number
}

interface FetchUserCheckInsUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
    limit,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page,
      limit,
    )

    if (!checkIns) {
      throw new ResourceNotFoundError()
    }

    return {
      checkIns,
    }
  }
}
