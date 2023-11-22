import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticationUser } from '../../../utils/test/create-and-auth-user'

describe('Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able create new gym', async () => {
    const gym = {
      title: 'any_gym_title',
      description: 'any_gym_description',
      phone: 'any_phone_id',
      latitude: -27.999,
      longitude: -49.999,
    }

    const { token } = await createAndAuthenticationUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    expect(response.statusCode).toEqual(201)
  })
})
