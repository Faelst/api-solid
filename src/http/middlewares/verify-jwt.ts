import { FastifyReply, FastifyRequest } from 'fastify'

export async function veriyJwt(req: FastifyRequest, rep: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch (err) {
    return rep.status(401).send({
      message: 'Unauthorized',
    })
  }
}
