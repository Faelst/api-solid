import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticationUser } from '../../../utils/test/create-and-auth-user'

describe('Near By Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able list nearby gyms', async () => {
    const gym = {
      title: 'any_gym_title',
      description: 'any_gym_description',
      phone: 'any_phone_id',
      latitude: -3.761916,
      longitude: -38.519214,
    }

    const { token } = await createAndAuthenticationUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...gym, latitude: -20.761916, longitude: -80.519214 })

    const response = await request(app.server)
      .get('/gyms/near-by')
      .query({
        latitude: -3.761916,
        longitude: -38.519214,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
  })
})
