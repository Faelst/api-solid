import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '../../app'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const newUser = {
      name: 'valid_any_name',
      email: 'valid_any@mail.com',
      password: 'valid_any_password',
    }

    await request(app.server).post('/users').send(newUser)

    const sessionResponse = await request(app.server)
      .post('/session')
      .send(newUser)

    const userResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${sessionResponse.body.token}`)

    expect(userResponse.statusCode).toEqual(200)
    expect(userResponse.body.user).toEqual(
      expect.objectContaining({
        email: newUser.email,
      }),
    )
  })
})
