import { Gym } from '@prisma/client'
import { GymsRepository } from '../repository/gyms.repository'

interface CreateGymUseCaseDto {
  title: string
  description?: string | null
  phone: string
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    description,
    title,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseDto): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      title,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
