import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticationUser } from '../../../utils/test/create-and-auth-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able search gyms by title', async () => {
    const gym = {
      title: 'any_gym_title',
      description: 'any_gym_description',
      phone: 'any_phone_id',
      latitude: -27.999,
      longitude: -49.999,
    }

    const { token } = await createAndAuthenticationUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...gym, title: 'different_title' })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: gym.title,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
  })
})
