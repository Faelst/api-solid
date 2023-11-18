import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticationUser } from '@/utils/test/create-and-auth-user'
import { prisma } from '@/lib/prisma'

describe('CheckIns History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check', async () => {
    const gym = await prisma.gym.create({
      data: {
        title: 'any_gym_title',
        description: 'any_gym_description',
        phone: 'any_phone_id',
        latitude: -27.999,
        longitude: -49.999,
      },
    })

    const { token, user } = await createAndAuthenticationUser(app)

    const { id: userId } = (await prisma.user.findFirst({
      where: { email: user.email },
    })) as { id: string }

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: userId,
        },
        {
          gym_id: gym.id,
          user_id: userId,
        },
      ],
    })

    const checkInResponse = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(checkInResponse.statusCode).toEqual(200)
    expect(checkInResponse.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: userId,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: userId,
      }),
    ])
  })
})
