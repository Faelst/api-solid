import { afterAll, beforeAll, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { describe } from 'node:test'

describe('Refresh (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const newUser = {
      name: 'valid_any_name',
      email: 'valid_any@mail.com',
      password: 'valid_any_password',
    }

    const createUserResponse = await request(app.server)
      .post('/users')
      .send(newUser)

    const sessionResponse = await request(app.server)
      .post('/session')
      .send(newUser)

    const cookies = sessionResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
