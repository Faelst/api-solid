import { afterAll, beforeAll, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { describe } from 'node:test'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'valid_any_name',
      email: 'valid_any@mail.com',
      password: 'valid_any_password',
    })

    expect(response.statusCode).toEqual(201)
  })
})
