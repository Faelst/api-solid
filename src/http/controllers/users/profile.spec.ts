import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticationUser } from '../../../utils/test/create-and-auth-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token, user } = await createAndAuthenticationUser(app)

    const userResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(userResponse.statusCode).toEqual(200)
    expect(userResponse.body.user).toEqual(
      expect.objectContaining({
        email: user.email,
      }),
    )
  })
})
