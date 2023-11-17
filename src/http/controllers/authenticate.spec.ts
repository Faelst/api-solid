import { afterAll, beforeAll, expect, it, test } from 'vitest'

import request from 'supertest'
import { app } from '../../app'
import { describe } from 'node:test'

describe('Authenticate (e2e)', () => {
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

    expect(createUserResponse.statusCode).toEqual(201)
    expect(sessionResponse.statusCode).toEqual(200)
    expect(sessionResponse.body).toEqual({
      token: expect.any(String),
    })
  })
})
