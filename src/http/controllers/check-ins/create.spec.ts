import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticationUser } from '../../../utils/test/create-and-auth-user'

describe('CheckIns Create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able create Check-In', async () => {
    const gym = {
      title: 'any_gym_title',
      description: 'any_gym_description',
      phone: 'any_phone_id',
      latitude: -27.999,
      longitude: -49.999,
    }

    const { token } = await createAndAuthenticationUser(app)

    const gymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    const gymId = gymResponse.body.gym.id

    const checkInResponse = await request(app.server)
      .post(`/gyms/${gymId}/check-in`)
      .query({
        latitude: -27.999,
        longitude: -49.999,
      })
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    expect(checkInResponse.statusCode).toEqual(201)
    expect(checkInResponse.body.checkIn).toEqual(
      expect.objectContaining({
        gym_id: gymId,
      }),
    )
  })
})
