import { FastifyRequest, FastifyReply } from 'fastify'

export const refresh = async (req: FastifyRequest, rep: FastifyReply) => {
  await req.jwtVerify({ onlyCookie: true })

  const { role } = req.user

  const token = await rep.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
      },
    },
  )

  const refreshToken = await rep.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return rep
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
